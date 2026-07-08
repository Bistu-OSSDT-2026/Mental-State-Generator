const CanvasText = (() => {
    const ctxProxy = CanvasBase.getCtx;
    const sizeProxy = CanvasBase.getSize;

    // 文字默认配置
    let textConfig = {
        content: "默认校园文案",
        fontSize: 28,
        font: "PingFang SC, Microsoft YaHei",
        fillColor: "#000000",
        strokeColor: "#ffffff",
        strokeWidth: 3,
        align: "center", // center / left
        lineHeight: 42
    }
    // 表情包底图路径
    let bgImgSrc = "";
    let bgImg = null;

    // 更新文字配置（外部面板调用）
    function setTextConfig(opt) {
        textConfig = Object.assign(textConfig, opt);
        canvasTextRender();
    }

    // 设置底图，素材存放 img/backgrounds/
    function setBgImg(src) {
        bgImgSrc = src;
        bgImg = new Image();
        bgImg.src = `./img/backgrounds/${src}`;
        bgImg.onload = canvasTextRender;
    }

    // 拆分文字换行
    function splitText(text) {
        const maxWidth = sizeProxy().w - 60;
        const lines = [];
        const ctx = ctxProxy();
        ctx.font = `${textConfig.fontSize}px ${textConfig.font}`;
        let tempStr = "";
        for (let char of text) {
            if (ctx.measureText(tempStr + char).width > maxWidth) {
                lines.push(tempStr);
                tempStr = char;
            } else {
                tempStr += char;
            }
        }
        tempStr && lines.push(tempStr);
        return lines;
    }

    // 核心渲染：底图 + 文字
    function canvasTextRender() {
        CanvasBase.clearAll();
        const ctx = ctxProxy();
        const { w, h } = sizeProxy();
        // 绘制表情包底图
        if (bgImg && bgImg.complete) {
            ctx.drawImage(bgImg, 0, 0, w, h);
        }
        // 绘制多行文字
        const lines = splitText(textConfig.content);
        const totalHeight = lines.length * textConfig.lineHeight;
        let startY = (h - totalHeight) / 2;
        ctx.textAlign = textConfig.align;
        ctx.font = `${textConfig.fontSize}px ${textConfig.font}`;
        ctx.fillStyle = textConfig.fillColor;
        ctx.strokeStyle = textConfig.strokeColor;
        ctx.lineWidth = textConfig.strokeWidth;

        lines.forEach(line => {
            let x = textConfig.align === "center" ? w / 2 : 30;
            ctx.strokeText(line, x, startY);
            ctx.fillText(line, x, startY);
            startY += textConfig.lineHeight;
        })
        // 渲染贴纸与水印
        window.stickerRender?.();
    }

    // 挂载全局，供canvasBase、4号js调用
    window.canvasTextRender = canvasTextRender;

    return {
        setTextConfig,
        setBgImg,
        render: canvasTextRender
    }
})

// canvasSticker.js — 画布水印绘制（装饰贴纸功能已删除）
const CanvasSticker = (() => {
    const ctxProxy = CanvasBase.getCtx;
    const sizeProxy = CanvasBase.getSize;
    const WATERMARK_TEXT = "BISTU";

    // 绘制BISTU半透明水印
    function drawWatermark(ctx, w, h) {
        ctx.save();
        ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'rgba(120, 120, 120, 0.25)';
        ctx.fillText(WATERMARK_TEXT, w - 12, h - 10);
        ctx.restore();
    }

    // 渲染水印
    function stickerRender() {
        const ctx = ctxProxy();
        const { w, h } = sizeProxy();
        drawWatermark(ctx, w, h);
    }

    // 挂载全局渲染方法
    window.stickerRender = stickerRender;

    return {
        render: stickerRender
    }
})();

function renderCanvas() {
    syncTextConfig();                    // 只更新配置
    CanvasBase.clearAll();               // 清空
    CanvasText.canvasTextRender();       // 绘制文字层
    CanvasSticker.stickerRender();       // 绘制贴纸+水印
    saveHistory();
}
