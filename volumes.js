const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { device } = require("./const.js");
const {
    getSinkVolume,
    setSinkVolume,
    toggleMute,
    getSinkInputVolume,
    setSinkInputVolume,
    toggleSinkInputMute,
} = require("./src/pactl.js");
const {
    mainSinkName,
    chromiumSinkName,
    spotifySinkName,
    firefoxSinkName,
} = require("./src/settings.js");
const { Image } = require("canvas");

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
    },
    knobTR: {
        name: firefoxSinkName,
        mute: toggleSinkInputMute,
        volume: setSinkInputVolume,
    },
};

const updateVolume = async () => {
    const mainVolume = await getSinkVolume(mainSinkName);
    const chromiumVolume = await getSinkInputVolume(chromiumSinkName);
    const spotifyVolume = await getSinkInputVolume(spotifySinkName);
    device.drawScreen("left", (ctx) => {
        ctx.font = "12x consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(mainVolume + "\nMain", 30, 45);
        ctx.fillText(spotifyVolume + "\nSpotify", 30, 135);
        ctx.fillText(chromiumVolume + "\nChrome", 30, 225);
    });
    const firefoxVolume = await getSinkInputVolume(firefoxSinkName);
    device.drawScreen("right", (ctx) => {
        ctx.font = "12x consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(firefoxVolume + "\nFirefox", 30, 45);
        // ctx.fillText(spotifyVolume + "\nSpotify", 30, 135)
        // ctx.fillText(chromiumVolume + "\nChrome", 30, 225)
    });
};

const volumesToggleMute = async (knob) => {
    if (knobs[knob] && knobs[knob].mute) {
        await knobs[knob].mute(knobs[knob].name);
        updateVolume();
        return;
    }
    console.log("mute", knob);
};

const changeVolume = async (knob, volume) => {
    if (knobs[knob] && knobs[knob].volume) {
        await knobs[knob].volume(knobs[knob].name, volume == 1 ? "+5%" : "-5%");
        updateVolume();
        return;
    }
    updateVolume();
};

module.exports = {
    updateVolume,
    toggleMute,
    changeVolume,
    toggleMute: volumesToggleMute,
};
