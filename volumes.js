const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { device } = require("./const.js")

const getVolume = async () => {
    const { stdout, sterr } = await exec("amixer get Master")
    for(let line of stdout.split("\n")) {
        if(line.indexOf('Front Left:') != -1){
            if(line.split(" ")[7] == "[off]")
                return "----"
            return line.split(" ")[6].replace("[", "").replace("]", "")
        }
    }
}

const updateVolume = async () => {
    const volumeStr = await getVolume()
    device.drawScreen("left", (ctx) => {
        ctx.font = "18px consolas";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "blue";
        ctx.fillText(volumeStr, 10, 45)
    })
}

const toggleMute = async () => {
  await exec("amixer set Master 1+ toggle")
  updateVolume()
}

const changeVolume = async (volume) => {
  volume = volume == 1 ? "5%+" : "5%-"
  await exec(`/usr/bin/amixer set Master ${volume}`)
  updateVolume()
}

module.exports = { updateVolume, toggleMute, changeVolume }
