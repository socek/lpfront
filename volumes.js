const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { device } = require("./const.js")
const { getSinkVolume, setSinkVolume, toggleMute, getSinkInputVolume, setSinkInputVolume, toggleSinkInputMute } = require("./src/pactl.js")
const { mainSinkName, chromiumSinkName, spotifySinkName } = require("./src/settings.js")
const { Image } = require('canvas');

const knobs = {
    knobTL: {
        name: mainSinkName,
        mute: toggleMute,
        volume: setSinkVolume,
    },
    knobCL: {
        name: spotifySinkName,
        mute: toggleSinkInputMute,
        volume: setSinkInputVolume,
    },
    knobBL: {
        name: chromiumSinkName,
        mute: toggleSinkInputMute,
        volume: setSinkInputVolume,
    }
}

const updateVolume = async () => {
    const mainVolume = await getSinkVolume(mainSinkName)
    const chromiumVolume = await getSinkInputVolume(chromiumSinkName)
    const spotifyVolume = await getSinkInputVolume(spotifySinkName)
    device.drawScreen("left", (ctx) => {
        ctx.font = "18px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(mainVolume, 10 , 45)
        ctx.fillText(spotifyVolume, 10, 135)
        ctx.fillText(chromiumVolume, 10, 225)
    })
}

const volumesToggleMute = async (knob) => {
    if (knobs[knob] && knobs[knob].mute) {
        await knobs[knob].mute(knobs[knob].name)
        updateVolume()
        return
    }
    console.log("mute", knob)
}

const changeVolume = async (knob, volume) => {
    if (knobs[knob] && knobs[knob].volume) {
        await knobs[knob].volume(knobs[knob].name, volume == 1 ? "+5%" : "-5%")
        updateVolume()
        return
    }
    updateVolume()
}

module.exports = {
    updateVolume,
    toggleMute,
    changeVolume,
    toggleMute: volumesToggleMute,
}

