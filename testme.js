import {
    getSinks
} from "./src/pulseaudio.js"
import Key from "./src/key.js"

import _ from 'lodash'

const start = async() => {
    // let sinks = await getSinks()
    // for (const sink of sinks) {
    //     console.log(sink.name, sink.type)
    // }
    // let first = (await getSinks())[0]
    // let second = (await getSinks(true))[0]

    // console.log("c", isSinksEqual(first, second))
    // console.log("c", first.data.latency, second.data.latency, )

    const left = {"one": 1}
    const right = {"one": 1}
    const third = {"one": 2}

    console.log(_.isEqual(left, right))
    console.log(_.isEqual(left, third))
}

start()
