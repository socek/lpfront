const util = require("util")
const exec = util.promisify(require("child_process").exec)
const ent = Object.entries
const {
  cacheInvalidationTime
} = require("../const.js")

let cache = null
let last_cache_refresh = null
const invalidateCache = () => {
  cache = null
  last_cache_refresh = null
}
const isCacheExpired = () => {
  const now = Date.now()
  console.log("checking", last_cache_refresh)
  return !last_cache_refresh || last_cache_refresh + cacheInvalidationTime > now
}

class PAItem {
  data;
  type;
  commands = {
    "mute": null,
    "setVolume": null,
  }

  constructor(data) {
    this.data = data
    this.name = data.description
  }

  getVolumes() {
    if (sink.mute) return null
    const volumes = []
    for (const [name, volume] of ent(this.data.volume)) {
      volumes.push({
        name: name,
        volume: volume.value_percent,
      })
    }
    return volumes
  }

  async setVolume(volume) {
    const cmd = `pactl ${this.commands.setVolume} ${this.data.index} ${volume}`
    await exec(cmd)
    invalidateCache()
  }
  async toggleMute() {
    const cmd = `pactl ${this.commands.mute} ${this.data.index} toggle`
    await exec(cmd)
    invalidateCache()
  }
}

class PASink extends PAItem {
  commands = {
    "mute": "set-sink-mute",
    "setVolume": "set-sink-volume",
  }
  constructor(data) {
    super(data)
    this.type = "Sink"
  }
}

class PASinkInput extends PAItem {
  commands = {
    "mute": "set-sink-input-mute",
    "setVolume": "set-sink-input-volume",
  }

  constructor(data) {
    super(data)
    this.name = data.properties["application.name"]
    this.type = "Sink Input"
  }
}

class PASourceOutput extends PAItem {
  commands = {
    "mute": "set-source-output-mute",
    "setVolume": "set-source-output-volume",
  }

  constructor(data) {
    super(data)
    this.type = "Source Output"
  }
}

const getSinks = async(force) => {
  if (!force && !isCacheExpired()) {
    return cache
  }
  const {
    stdout,
    stderr
  } = await exec("pactl -f json list")
  const items = []
  const result = JSON.parse(stdout)

  for (const element of result["sinks"]) {
    items.push(new PASink(element))
  }
  for (const element of result["sink_inputs"]) {
    items.push(new PASinkInput(element))
  }
  for (const element of result["source_outputs"]) {
    items.push(new PASourceOutput(element))
  }
  cache = items
  last_cache_refresh = Date.now()
  return items
}

module.exports = {
  getSinks,
}
