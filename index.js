import {
    establishConnection,
    beforeExit,
} from './device.js'

process.on('SIGINT', async() => {
    console.log("SIGINT")
    await beforeExit()
    process.exit()
});

const start = async() => {
    establishConnection()
}

start()
