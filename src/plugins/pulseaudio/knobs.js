const {
  CircleKnob
} = await imp("@src/lp/knob.js")
const {
  entries
} = await imp('@src/utils.js')
import {
  getSinkByName
} from "./pulseaudio.js"

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
          "text": `${name}`,
          "background": "red",
          "percentage": 0,
          "muted": true,
          "state": true,
        }
      }
      for (const [key, volume] of entries(sink.data.volume)) {
        return {
          "text": `${name}`,
          "percentage": volume.value_percent.replace('%', ''),
          "background": "black",
          "muted": false,
          "state": true,
        }
      }
    }
    return {
      "text": `${name}`,
      "background": "grey",
      "percentage": 0,
      "muted": false,
      "state": false,
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
  return new CircleKnob(index, name, {
    updateData,
    onClick,
    onChange
  })
}
