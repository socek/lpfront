const { LoupedeckDevice, HAPTIC } = require('loupedeck')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {Image} = require('canvas');

var img = new Image();
img.src = 'key.png'

// Detects and opens first connected device
const device = new LoupedeckDevice({autoConnect: false})
const state = {
    connected: false,
}
const getVolume = async () => {
    const { stdout, sterr } = await exec("amixer get Master")
    for(let line of stdout.split("\n")) {
        if(line.indexOf('Front Left:') != -1){
            if(line.split(" ")[7] == "[off]")
                return "---"
            return line.split(" ")[6].replace("[", "").replace("]", "")
        }
    }
}

const updateVolume = async () => {
    const volumeStr = await getVolume()
    device.drawScreen("left", (ctx) => {
        ctx.font = "20px serif";
        ctx.textBaselin = "middle";
        ctx.fillStyle = "blue";
        ctx.fillText(volumeStr, 10, 45)
    })
}

// Observe connect events
device.on('connect', async () => {
    console.info('Connection successful!')
    state.connected = true
    device.setBrightness(1)
    updateVolume()
})

// React to button presses
device.on('down', ({ id }) => {
    console.info(`Button pressed: ${id}`)
    if(id == "knobTL") {

        exec("amixer set Master 1+ toggle", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            updateVolume()
            console.info("Success...")
        });
    }
})

device.on('touchstart', (payload) => {
    device.vibrate(HAPTIC.SHORT)
    const target = payload.changedTouches[0].target
  console.info(`Screen pressed: ${target.key}`)
})

const DELTAS = {
    "-1": "5%-",
    "1": "5%+",
}

// React to knob turns
device.on('rotate', ({ id, delta }) => {
    console.info(`Knob ${id} rotated: ${delta}`)
    if (id == "knobTL") {

        exec(`/usr/bin/amixer -D pulse set Master ${DELTAS[delta]}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            updateVolume()
        });
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForConnect = async () => {
    await sleep(1000)
    if(!state.connected) {
        console.info("Not connected, retrying...")
        device.close()
        device.connect()
    }
}

device.on('disconnect', (payload) => {
    console.log("Disconnect", payload)
    state.connected = false
})

waitForConnect()
device.connect().catch((payload) => {
    console.log("catch:", payload)
});

process.on('SIGINT', async () => {
    console.log("SIGINT")
    if(state.connected) {
        console.log("setBright")
        await device.setBrightness(0.1)
        await device.close()
    }
    process.exit()
});
