const Plugin = await imp("@src/plugin.js", true)
import {
  setActiveScene,
  virtualCameraToggle,
  streamToggle,
  sourceToggle,
} from "./keys.js"

export default class ObsPlugin extends Plugin {
  name = "obs"

  getAvalibleKeys() {
    return {
      setActiveScene,
      virtualCameraToggle,
      streamToggle,
      sourceToggle,
    }
  }
}
