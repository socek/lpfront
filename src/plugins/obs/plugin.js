const Plugin = await imp("@src/plugin.js", true)
import {
  setActiveScene,
  virtualCameraToggle,
  streamToggle,
  sourceToggle,
  replyBufferToggle,
  saveReplayBuffer,
} from "./keys.js"
import {
  sourceKnob,
} from "./knobs.js"
import {endAllConnections} from "./external.js"

export default class ObsPlugin extends Plugin {
  name = "obs"

  getAvalibleKeys() {
    return {
      setActiveScene,
      virtualCameraToggle,
      streamToggle,
      sourceToggle,
      replyBufferToggle,
      saveReplayBuffer,
    }
  }

  getAvalibleKnobs() {
    return {
      "Source": sourceKnob
    }
  }

  async onExit() {
    await endAllConnections()
  }
}
