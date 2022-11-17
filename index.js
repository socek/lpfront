const {
    establishConnection,
    beforeExit,
} = require('./device.js')

const pactl = require("./src/pactl.js")


process.on('SIGINT', async() => {
    console.log("SIGINT")
    beforeExit()
    process.exit()
});

const start = async() => {
    establishConnection()
}

start()
const {
    getSinks
} = require("./src/pulseaudio.js")

async function elo() {
    sinks = await getSinks()
    for (sink of sinks) {
        if (sink.name == "Spotify") {
            await sink.setVolume("+5%")
        }
    }
    sinks = await getSinks()
    for (sink of sinks) {
        if (sink.name == "Spotify") {
            console.log(sink.type, sink.name, sink.data.mute, sink.getVolumes())
        }
    }
}
// elo()
