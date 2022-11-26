import "./imports.js"
// const {
//     isEqual
// } = await imp('lodash', true)
// const {
//     mainSinkName
// } = await imp('@src/settings.js')
// const Page = await imp("@src/lp/page.js", true)
// const OBSWebSocket = await imp('obs-websocket-js')

// console.log("isEqual", isEqual)
// console.log("mainSinkName", mainSinkName)
// console.log("Page", Page)
// console.log("OBSWebSocket", OBSWebSocket)
const {spotifySinkName} = await imp("@src/settings.js")
console.log(await getSinkByName(spotifySinkName))

const start = async() => {
    // const obs = new OBSWebSocket();
    // await obs.connect('ws://127.0.0.1:4455', "7NvMa1NwRTCssaXI")
    // console.log("Connected...")
    // try {
    //     await obs.call('SetCurrentProgramScene', {
    //         sceneName: 'Mój Ryj'
    //     })
    // } catch (error) {
    //     console.log("e", error)
    // }

    // await new Promise(r => setTimeout(r, 1000))

    // try {
    //     await obs.call('SetCurrentProgramScene', {
    //         sceneName: 'Gra'
    //     })
    // } catch (error) {
    //     console.log("e", error)
    // }

    // await new Promise(r => setTimeout(r, 1000))

    // try {
    //     await obs.call('SetCurrentProgramScene', {
    //         sceneName: 'Pulpit Środek'
    //     })
    // } catch (error) {
    //     console.log("e", error)
    // }

    // console.log(process.cwd())
}

start()
