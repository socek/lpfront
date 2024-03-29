const {
  cacheInvalidationTime
} = await imp("@/src/consts.js")
const {
  isEqual
} = await imp('lodash', true)
const {
  exec,
  entries
} = await imp('@src/utils.js')

let cache = null
let last_cache_refresh = null
const invalidateCache = () => {
  cache = null
  last_cache_refresh = null
}

const isCacheExpired = () => {
  const now = Date.now()
  return !last_cache_refresh || (now - (last_cache_refresh + cacheInvalidationTime)) > 0
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

  getVolume() {
    if (sink.mute) return null
    for (const [name, volume] of entries(this.data.volume)) {
      return volume.value_percent
    }
    return null
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

  async switchOutput(outputId) {
    const cmd = `pactl move-sink-input ${this.data.index} ${outputId}`
    await exec(cmd)
    invalidateCache()
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
    this.name = data.properties["application.name"]
  }
}

export const getSinks = async(force) => {
  if (!force && !isCacheExpired()) {
    return cache
  }
  const {
    stdout,
    stderr
  } = await exec("pactl -f json list")
  const result = JSON.parse(stdout)

  const items = []
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

export const getSinkByName = async(name, typename) => {
  const sinks = await getSinks()
  const results = []
  for (const paitem of sinks) {
    if (paitem.name === name) {
      if (typename) {
        if (paitem.type === typename) {
          results.push(paitem)
        }
      } else {
        results.push(paitem)
      }
    }
  }
  return results
}

export const isSinksEqual = (left, right) => {
  // Making copies of an object in JS is so unefficent
  left = JSON.parse(JSON.stringify(left))
  right = JSON.parse(JSON.stringify(left))
    // Latency is a very dynamicly change value
  delete left.data.latency
  delete right.data.latency
  return isEqual(left, right)
}

export const getSinksByType = async(typename) => {
  const sinks = await getSinks()
  const results = []
  for (const paitem of sinks) {
    if (paitem.type === typename) {
      results.push(paitem)
    }
  }
  return results
}
