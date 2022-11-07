const { device } = require("../const.js")

const drawPrev = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(0, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas"
        ctx.textBaselin = "middle"
        ctx.fillStyle = "white"
        ctx.fillText("Previous", 15 , 45)
    })
}

const drawPlay = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(1, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.fillText("Play", 30 , 45)
    })
}

const drawNext = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(2, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.fillText("Next", 30 , 45)
    })
}

const updateKey = async () => {
    drawPrev()
    drawPlay()
    drawNext()
}

const hoverKey = async (key) => {
    if (key === 0) {
        await drawPrev("green")
        return
    }
    if (key === 1) {
        await drawPlay("green")
        return
    }
    if (key === 2) {
        await drawNext("green")
        return
    }

    device.drawKey(key, (ctx) => {
        ctx.fillStyle = "green"
        ctx.fillRect(0, 0, 90, 90)
    })
}

const downKey = async (key) => {
    device.drawKey(key, (ctx) => {
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 90, 90)
    })
}

module.exports = {
    updateKey,
    hoverKey,
    downKey,
}
