import _ from 'lodash'
import OBSWebSocket from 'obs-websocket-js'

const start = async() => {
    const obs = new OBSWebSocket();
    await obs.connect('ws://127.0.0.1:4455', "7NvMa1NwRTCssaXI")
    console.log("Connected...")
    try {
        await obs.call('SetCurrentProgramScene', {
            sceneName: 'Mój Ryj'
        })
    } catch (error) {
        console.log("e", error)
    }

    await new Promise(r => setTimeout(r, 1000))

    try {
        await obs.call('SetCurrentProgramScene', {
            sceneName: 'Gra'
        })
    } catch (error) {
        console.log("e", error)
    }

    await new Promise(r => setTimeout(r, 1000))

    try {
        await obs.call('SetCurrentProgramScene', {
            sceneName: 'Pulpit Środek'
        })
    } catch (error) {
        console.log("e", error)
    }

    // console.log(process.cwd())
}

start()
