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
Gitee - 基于 Git 的代码托管和研发协作平台
