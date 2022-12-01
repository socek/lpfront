import "./imports.js"
const {
    inspect
} = await imp('util')
const {
    getWorkspaceByName
} = await imp("@src/plugins/i3/external.js")

// const Application = await imp("@src/app.js", true)
// const PulseAudioPlugin = await imp("@src/plugins/pulseaudio/plugin.js", true)

const {
    psLookup
} = await imp('@src/utils.js')

const result = await psLookup({
    command: '/usr/bin/obs',
});

console.log("a", result)

const start = async() => {
    // const app = new Application()
    // app.addPlugin(new PulseAudioPlugin())
    // await app.readConfiguration()
    // await app.applyConfiguration()
    // console.log(await getWorkspaceByName("w"));
}

start()
