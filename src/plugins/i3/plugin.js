const Plugin = await imp("@src/plugin.js", true)
import {
  worskpace
} from "./keys.js"

export default class I3Plugin extends Plugin {
  name = "i3"

  getAvalibleKeys() {
    return {
      worskpace
    }
  }
}
