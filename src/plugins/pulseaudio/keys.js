const Key = await imp("@src/lp/key.js", true)
const {
  getSinkByName,
  getSinksByType,
} = await imp("@src/plugins/pulseaudio/pulseaudio.js")

const sinkType = "Source Output"

export const microphoneKey = (index, {name, sinkName}) => {
  async function onClick() {
    const sinks = await getSinkByName(sinkName, sinkType)
    for (const sink of sinks) {
      sink.toggleMute()
    }
    this.refresh()
  }

  async function updateData() {
    const sinks = await getSinkByName(sinkName, sinkType)
    if (sinks.length == 0) {
      return {
        "background": "grey",
        "text": `${this.name}\nOff`
      }
    }
    for (const sink of sinks) {
      if (sink.data.mute) {
        return {
          "background": "red",
          "text": `${this.name}\nMuted`
        }
      }
    }
    return {
      "background": "green",
      "text": `${this.name}\nOn`
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

export const sinkSwitchKey = (index, {name, sinkName}) => {
  async function onClick() {
    const output = await getSinkByName(sinkName, "Sink")
    const appSinks = await getSinksByType("Sink Input")
    for (const sink of appSinks) {
      sink.switchOutput(output[0].data.index)
    }
    this.refresh()
  }

  async function updateData() {
    return {
      "background": "black",
      "text": `${this.name}`
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}
