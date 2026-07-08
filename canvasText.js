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
    // ====== 新增：文字/emoji 拖拽偏移量 ======
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // 更新文字配置（外部面板调用）
    function setTextConfig(opt) {
        textConfig = Object.assign(textConfig, opt);
        canvasTextRender();
    }

    // ====== 新增：设置拖拽偏移量 ======
    function setDragOffset(dx, dy) {
        dragOffsetX = dx;
        dragOffsetY = dy;
        canvasTextRender();
    }

    // ====== 新增：重置拖拽偏移量 ======
    function resetDragOffset() {
        dragOffsetX = 0;
        dragOffsetY = 0;
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
            // ====== 修改：emoji 固定位置，不跟随文字拖拽 ======
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
            const xPos = w / 2 + dragOffsetX;
            const y = startY + idx * lineHeight + dragOffsetY;

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
        setDragOffset,      // ====== 新增导出 ======
        resetDragOffset,    // ====== 新增导出 ======
        render: canvasTextRender
    }
})();