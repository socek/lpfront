import "./imports.js"

const {
    OBSDriver
} = await imp("@src/plugins/obs/external.js")
const obs = new OBSDriver()
const {
    log_def_to_db,
    log_db_to_def
} = await imp("@src/plugins/obs/db.js")

const start = async() => {
    // console.log('ss', await setVolume('Sound BlasterX G6', 'S/PDIF In', '5%+'))
    // const app = new Application()
    // app.addPlugin(new PulseAudioPlugin())
    // await app.readConfiguration()
    // await app.applyConfiguration()

    const conn = await obs.establishConnection()
    const percentage = await obs.getVolume("Desktop")
    console.log("Setting:", percentage - 5)
    await obs.setVolume("Desktop", percentage - 5)
}

await start()
