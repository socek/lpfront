
// // React to button presses
// device.on('down', ({ id }) => {
//     console.info(`Button pressed: ${id}`)
//     if(id == "knobTL") {

//         exec("amixer set Master 1+ toggle", (error, stdout, stderr) => {
//             if (error) {
//                 console.log(`error: ${error.message}`);
//                 return;
//             }
//             if (stderr) {
//                 console.log(`stderr: ${stderr}`);
//                 return;
//             }
//             updateVolume()
//             console.info("Success...")
//         });
//     }
// })

// device.on('touchstart', (payload) => {
//     device.vibrate(HAPTIC.SHORT)
//     const target = payload.changedTouches[0].target
//   console.info(`Screen pressed: ${target.key}`)
// })

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
    // await pactl.init()
    establishConnection()
    // console.log(await pactl.getSinkInputs())
}
start()
