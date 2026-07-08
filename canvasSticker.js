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