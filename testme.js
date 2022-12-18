import "./imports.js"

const { setVolume } = await imp("@src/plugins/amixer/amixer.js")

const start = async() => {
    console.log('ss', await setVolume('Sound BlasterX G6', 'S/PDIF In', '5%+'))
    // const app = new Application()
    // app.addPlugin(new PulseAudioPlugin())
    // await app.readConfiguration()
    // await app.applyConfiguration()
    // console.log(await getWorkspaceByName("w"));
}

start()
