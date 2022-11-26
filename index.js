import "./imports.js"
import {
    establishConnection,
    beforeExit,
} from './device.js'

const cleanExit = async function() {
    console.log("\rExiting...")
    await beforeExit()
    process.exit()
};
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill

const start = async() => {
    establishConnection()
}

start()
