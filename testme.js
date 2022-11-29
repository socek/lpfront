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
// const {spotifySinkName} = await imp("@src/settings.js")
// console.log(await getSinkByName(spotifySinkName))

const me = (fun) => {
    function wrapper() {
        console.log("wrapper", this)
        return fun()
    }
    return wrapper
}

class Abc {
    constructor() {
        console.log("Abc: A")
        this.doSomething = me(this.doSomething.bind(this))
    }


    doSomething() {
        console.log("something", this)
    }

}



const elo = me(() => {
    console.log('elo')
})

const {
    OBSDriver,
} = await imp("@src/externals/obs.js")

const start = async() => {
    // const obs = new OBSDriver()
    // await obs.establishConnection()
    console.log("c")
    elo()

    const abc = new Abc()
    console.log("d")
    abc.doSomething()
        // let result = await obs.obs.call("GetSceneItemId", {sceneName: "Pulpit Środek", sourceName: "Kamera"})
        // const sceneItemId = result.sceneItemId

    // result = await obs.obs.call("GetSceneItemEnabled", {sceneName: "Pulpit Środek", sceneItemId})
    // console.log(result)
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
