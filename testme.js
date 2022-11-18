const {
    getSinks,
    isSinksEqual,
} = require("./src/pulseaudio.js")


const start = async() => {
    let sinks = await getSinks()
    for(const sink of sinks) {
        console.log(sink.name, sink.type)
    }
    // let first = (await getSinks())[0]
    // let second = (await getSinks(true))[0]

    // console.log("c", isSinksEqual(first, second))
    // console.log("c", first.data.latency, second.data.latency, )
}

start()
