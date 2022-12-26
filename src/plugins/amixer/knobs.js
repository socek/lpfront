const Knob = await imp("@src/lp/knob.js", true)
const {
  entries
} = await imp('@src/utils.js')
import {
  getVolumes,
  toggleMute,
  setVolume
} from "./amixer.js"

export const ControllerKnob = (index, {
  name,
  cardName,
  ctrlName
}) => {
  async function updateData() {
    const volumes = await getVolumes(cardName, ctrlName)
    const name = `${this.name}\n`

    if (entries(volumes).length > 0) {
      const [key, volume] = entries(volumes)[0]
      if (volume.state === 'off') {
        return {
          "text": `${name}(mute)`,
          "background": "red",
        }
      }
      return {
        "text": `${name}${volume.volume}%`,
        "background": "green",
      }
    }
    return {
      "text": `${name}(off)`,
      "background": "grey",
    }
  }

  async function onClick() {
    await toggleMute(cardName, ctrlName)
  }
  async function onChange(delta) {
    await setVolume(cardName, ctrlName, delta == 1 ? "5%+" : "5%-")
  }
  return new Knob(index, name, {
    updateData,
    onClick,
    onChange
  })
}
