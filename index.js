
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
    ensureConnectionWorker,
} = require('./device.js')

process.on('SIGINT', async () => {
    console.log("SIGINT")
    await beforeExit()
    process.exit()
});
establishConnection()
