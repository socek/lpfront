const Plugin = await imp("@src/plugin.js", true)
import {
  ControllerKnob
} from "./knobs.js"

export default class AMixerPlugin extends Plugin {
  name = "amixer"

  getAvalibleKnobs() {
    return {
      "Controller": ControllerKnob
    }
  }
}
