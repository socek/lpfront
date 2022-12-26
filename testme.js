import "./imports.js"

const {
    getSinks
} = await imp("@src/plugins/pulseaudio/pulseaudio.js")

const start = async() => {
    const result = await getSinks()
    for(const row of result) {
        console.log(row.name)
    }
}

await start()
