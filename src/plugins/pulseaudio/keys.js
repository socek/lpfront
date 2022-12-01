const Key = await imp("@src/lp/key.js", true)
const {
  getSinkByName,
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
