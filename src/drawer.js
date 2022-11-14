const { device } = require("../const.js")

const drawPrev = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(0, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas"
        ctx.textBaselin = "middle"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText("Previous", 45 , 45)
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
        ctx.textAlign = "center"
        ctx.fillText("Play", 45 , 45)
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
        ctx.textAlign = "center"
        ctx.fillText("Next", 45 , 45)
    })
}

const drawFirefox = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(4, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("Firefox", 45 , 45)
    })
}

const drawChrome = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(5, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("Chrome", 45 , 45)
    })
}

const drawObs = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(6, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("OBS", 45 , 45)
    })
}

const drawSublime = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(7, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("ST", 45 , 45)
    })
}

const drawSpotify = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(8, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.textAlign = "center"
        ctx.fillStyle = "white";
        ctx.fillText("Spotify", 45 , 45)
    })
}

const drawSlack = async (fillStyle) => {
    fillStyle = fillStyle || "black"
    device.drawKey(9, (ctx) => {
        ctx.fillStyle = fillStyle
        ctx.fillRect(0, 0, 90, 90)
        ctx.font = "14px consolas";
        ctx.textBaselin = "middle";
        ctx.textAlign = "center"
        ctx.fillStyle = "white";
        ctx.fillText("Slack", 45 , 45)
    })
}

const updateKey = async () => {
    drawPrev()
    drawPlay()
    drawNext()
    drawFirefox()
    drawChrome()
    drawObs()
    drawSublime()
    drawSpotify()
    drawSlack()
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
    if (key === 4) {
        await drawFirefox("green")
        return
    }
    if (key === 5) {
        await drawChrome("green")
        return
    }
    if (key === 6) {
        await drawObs("green")
        return
    }
    if (key === 7) {
        await drawSublime("green")
        return
    }
    if (key === 8) {
        await drawSpotify("green")
        return
    }
    if (key === 9) {
        await drawSlack("green")
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
