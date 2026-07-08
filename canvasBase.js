// canvasBase.js 画布基础层
const CanvasBase = (() => {
    // 全局画布变量
    let canvas, ctx;
    // 两种尺寸：方形表情包 / 朋友圈竖图（与UI下拉选项一致）
    const sizeMap = {
        square: { w: 600, h: 600 },
        vertical: { w: 600, h: 900 }
    };
    let currentSizeType = "square";
    let bgColor = "#ffffff";

    // 初始化画布
    function initCanvas(canvasDomId = "mainCanvas") {
        canvas = document.getElementById(canvasDomId);
        ctx = canvas.getContext("2d");
        resizeCanvas();
        renderBg();
    }

    // 切换画布尺寸
    function setSize(type) {
        if (!sizeMap[type]) return;
        currentSizeType = type;
        resizeCanvas();
        renderBg();
        // 触发全局重绘文字+贴纸（给canvasText、canvasSticker调用）
        window.canvasTextRender?.();
        window.stickerRender?.();
    }

    // 修改背景纯色
    function setBgColor(color) {
        bgColor = color;
        renderBg();
        window.canvasTextRender?.();
        window.stickerRender?.();
    }

    // 重置画布宽高
    function resizeCanvas() {
        const { w, h } = sizeMap[currentSizeType];
        canvas.width = w;
        canvas.height = h;
    }

    // 绘制纯色背景
    function renderBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 清空整个画布
    function clearAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderBg();
    }

    // 对外暴露接口
    return {
        initCanvas,
        setSize,
        setBgColor,
        clearAll,
        getCtx: () => ctx,
        getCanvas: () => canvas,
        getSize: () => sizeMap[currentSizeType]
    }
})();