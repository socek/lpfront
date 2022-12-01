const Plugin = await imp("@src/plugin.js", true)
import {
  startApplication
} from "./keys.js"

export default class ExecPlugin extends Plugin {
  name = "exec"

  getAvalibleKeys() {
    return {
      startApplication
    }
  }
}
