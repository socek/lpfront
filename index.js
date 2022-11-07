const {
    establishConnection,
    beforeExit,
} = require('./device.js')

const pactl = require("./src/pactl.js")


process.on('SIGINT', async () => {
    console.log("SIGINT")
    await beforeExit()
    process.exit()
});

const start = async () => {
    establishConnection()
    // console.log(await pactl.getSinkInputs())
}
start()
