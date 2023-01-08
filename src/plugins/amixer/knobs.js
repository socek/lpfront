const {
  CircleKnob
} = await imp("@src/lp/knob.js")
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
          "text": `${name}`,
          "background": "red",
          "percentage": 0,
          "muted": true,
          "state": true,
        }
      }
      return {
        "text": `${name}`,
        "percentage": volume.volume,
        "background": "black",
        "muted": false,
        "state": true,
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
    await toggleMute(cardName, ctrlName)
  }
  async function onChange(delta) {
    await setVolume(cardName, ctrlName, delta == 1 ? "5%+" : "5%-")
  }
  return new CircleKnob(index, name, {
    updateData,
    onClick,
    onChange
  })
}
