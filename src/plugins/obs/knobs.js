import {
  obs
} from "./consts.js"
const {
  STATES
} = await imp("@/src/consts.js")
const Knob = await imp("@src/lp/knob.js", true)

export const sourceKnob = (index, {
  name,
  inputName,
  changeValue
}) => {
  changeValue = changeValue || 3
  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let volume = null
      let isMuted = null
      try {
        isMuted = await obs.getInputMute(inputName)
        volume = Math.round(await obs.getVolume(inputName))
      } catch (er) {
        return {
          "text": `${this.name}\n(error)`,
          "volume": null,
          "isMuted": null,
        }
      }
      if(isMuted) {
        return {
          "text": `${this.name}\n(MUTED)`,
          "volume": volume,
          "isMuted": isMuted,
        }
      } else {
        return {
          "text": `${this.name}\n${volume}%`,
          "volume": volume,
          "isMuted": isMuted,
        }
      }
    }

    return {
      "text": `${this.name}`,
      "volume": null,
      "isMuted": null,
    }
  }

  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      obs.toggleInputMute(inputName)
    }
  }
  async function onChange(delta) {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      if(this.data.volume !== undefined) {
        const volume = this.data.volume + changeValue * (delta == 1 ? 1 : -1)
        this.data.volume = volume
        this._last_update = Date.now()
        await obs.setVolume(inputName, volume)
      }
    }
  }
  return new Knob(index, name, {
    updateData,
    onClick,
    onChange
  })
}
