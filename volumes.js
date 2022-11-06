const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { device } = require("./const.js")
const { getSinkVolume, setSinkVolume, toggleMute } = require("./src/pactl.js")
const { mainSinkName } = require("./src/settings.js")

const updateVolume = async () => {
    const volumeStr = getSinkVolume(mainSinkName)
    device.drawScreen("left", (ctx) => {
        ctx.font = "18px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "blue";
        ctx.fillText(volumeStr, 10, 45)
    })
}

const volumesToggleMute = async () => {
    await toggleMute(mainSinkName)
    updateVolume()
}

const changeVolume = async (volume) => {
    await setSinkVolume(mainSinkName, volume == 1 ? "+5%" : "-5%")
    updateVolume()
}


module.exports = {
    updateVolume,
    toggleMute,
    changeVolume,
    toggleMute: volumesToggleMute,
}

