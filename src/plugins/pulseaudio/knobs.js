const Knob = await imp("@src/lp/knob.js", true)
const {
  getSinkByName,
} = await imp("@src/externals/pulseaudio.js")
const {
  entries
} = await imp('@src/utils.js')

export const sinkKnob = (index, {
  name,
  sinkName,
  sinkType
}) => {
  async function updateData() {
    const sinks = await getSinkByName(sinkName, sinkType)
    const name = `${this.name}\n`
    for (const sink of sinks) {
      if (sink.data.mute) {
        return {
          "text": `${name}(mute)`
        }
      }
      for (const [key, volume] of entries(sink.data.volume)) {
        return {
          "text": `${name}${volume.value_percent}`
        }
      }
    }
    return {
      "text": `${name}(off)`
    }
  }

  async function onClick() {
    const sinks = await getSinkByName(sinkName, sinkType)
    for (const sink of sinks) {
      await sink.toggleMute()
    }
  }
  async function onChange(delta) {
    const sinks = await getSinkByName(sinkName, sinkType)
    for (const sink of sinks) {
      await sink.setVolume(delta == 1 ? "+5%" : "-5%")
    }
  }
  return new Knob(index, name, {
    updateData,
    onClick,
    onChange
  })
}
