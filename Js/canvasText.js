// canvasText.js — 仅定义 CanvasText（文字绘制）
const CanvasText = (() => {
    const ctxProxy = CanvasBase.getCtx;
    const sizeProxy = CanvasBase.getSize;

    // 文字默认配置
    let textConfig = {
        content: "今天也是元气满满的一天呢",
        fontSize: 36,
        font: '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
        fillColor: "#000000",
        strokeColor: "#ffffff",
        strokeWidth: 3,
        align: "center",
        lineHeight: 50
    };

    // 当前选中 emoji（大号表情包）
    let currentEmoji = "😆";
    // 表情包显示开关
    let emojiVisible = true;
    // 导入的图片
    let importedImage = null;

    // 更新文字配置（外部面板调用）
    function setTextConfig(opt) {
        textConfig = Object.assign(textConfig, opt);
        canvasTextRender();
    }

    // 设置表情包 emoji
    function setEmoji(emoji) {
        currentEmoji = emoji;
        canvasTextRender();
    }

    // 设置表情包显示开关
    function setEmojiVisible(visible) {
        emojiVisible = visible;
        canvasTextRender();
    }

    // 获取表情包显示状态
    function getEmojiVisible() {
        return emojiVisible;
    }

    // 设置导入图片
    function setImportedImage(img) {
        importedImage = img;
        canvasTextRender();
    }

    // 清除导入图片
    function clearImportedImage() {
        importedImage = null;
        canvasTextRender();
    }

    // 拆分文字换行（按十个"正"字宽度分行）
    function splitText(text) {
        const ctx = ctxProxy();
        ctx.font = `${textConfig.fontSize}px ${textConfig.font}`;
        const maxWidth = ctx.measureText('正'.repeat(10)).width;
        const lines = [];
        let tempStr = "";
        for (let char of text) {
            if (ctx.measureText(tempStr + char).width > maxWidth && tempStr.length > 0) {
                lines.push(tempStr);
                tempStr = char;
            } else {
                tempStr += char;
            }
        }
        tempStr && lines.push(tempStr);
        if (lines.length === 0) lines.push(' ');
        return lines;
    }

    // 核心渲染：背景 → 导入图片 → emoji → 文字
    function canvasTextRender() {
        CanvasBase.clearAll();
        const ctx = ctxProxy();
        const { w, h } = sizeProxy();

        // ---- 导入的图片 (cover 模式，铺满画布且保持比例) ----
        if (importedImage) {
            const imgRatio = importedImage.width / importedImage.height;
            const canvasRatio = w / h;
            let drawW, drawH, drawX, drawY;
            if (imgRatio > canvasRatio) {
                // 图片更宽：以高度为准，左右裁剪
                drawH = h;
                drawW = h * imgRatio;
                drawX = (w - drawW) / 2;
                drawY = 0;
            } else {
                // 画布更宽或相等：以宽度为准，上下裁剪
                drawW = w;
                drawH = w / imgRatio;
                drawX = 0;
                drawY = (h - drawH) / 2;
            }
            ctx.drawImage(importedImage, drawX, drawY, drawW, drawH);
        }

        // ---- 表情包 (大号emoji) ----
        if (emojiVisible) {
            ctx.font = '120px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#222';
            ctx.fillText(currentEmoji, w / 2, h / 2 - 40);
        }

        // ---- 主文案 ----
        const lines = splitText(textConfig.content);
        const fontSize = textConfig.fontSize;
        const lineHeight = fontSize * 1.4;
        const maxWidth = ctx.measureText('正'.repeat(10)).width;
        const twoZhengWidth = maxWidth / 5;
        let startY = h - 40 - (lines.length - 1) * lineHeight / 2 - twoZhengWidth;

        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.font = `${fontSize}px ${textConfig.font}`;

        lines.forEach((line, idx) => {
            const xPos = w / 2;
            const y = startY + idx * lineHeight;

            if (textConfig.strokeWidth > 0) {
                ctx.lineWidth = textConfig.strokeWidth;
                ctx.strokeStyle = textConfig.strokeColor;
                ctx.strokeText(line, xPos, y);
            }
            ctx.fillStyle = textConfig.fillColor;
            ctx.fillText(line, xPos, y);
        });
        // 水印由上层（HTML renderCanvas）统一调度，此处不调用
    }

    // 挂载全局，供其他模块调用
    window.canvasTextRender = canvasTextRender;

    return {
        setTextConfig,
        setEmoji,
        setEmojiVisible,
        getEmojiVisible,
        setImportedImage,
        clearImportedImage,
        render: canvasTextRender
    }
})();

// canvasSticker.js 贴纸、导出水印 3号文件3
const CanvasSticker = (() => {
    const ctxProxy = CanvasBase.getCtx;
    const sizeProxy = CanvasBase.getSize;
    // 贴纸数组：{src,x,y,w,h}
    let stickerList = [];
    const WATERMARK_TEXT = "BISTU";

    // 添加贴纸，素材存放 img/stickers/
    function addSticker(imgName, x = 20, y = 20, w = 80, h = 80) {
        const img = new Image();
        img.src = `./img/stickers/${imgName}`;
        stickerList.push({ img, x, y, w, h });
        img.onload = stickerRender;
    }

    // 删除指定下标贴纸
    function delSticker(index) {
        stickerList.splice(index, 1);
        stickerRender();
    }

    // 清空所有贴纸
    function clearStickers() {
        stickerList = [];
        stickerRender();
    }

    // 绘制BISTU半透明水印
    function drawWatermark() {
        const ctx = ctxProxy();
        const { w, h } = sizeProxy();
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = "#666666";
        ctx.font = "16px Arial";
        ctx.fillText(WATERMARK_TEXT, w - 70, h - 12);
        ctx.restore();
    }

    // 渲染全部贴纸 + 水印
    function stickerRender() {
        window.canvasTextRender?.();
        const ctx = ctxProxy();
        stickerList.forEach(item => {
            if (item.img.complete) {
                ctx.drawImage(item.img, item.x, item.y, item.w, item.h);
            }
        })
        drawWatermark();
    }

    // 挂载全局渲染方法
    window.stickerRender = stickerRender;

    return {
        addSticker,
        delSticker,
        clearStickers,
        render: stickerRender
    }
})();
