import {
  OBSDriver
} from "./external.js"
const {
  isEqual
} = await imp('lodash', true)

const Key = await imp("@src/lp/key.js", true)
const {
  STATES
} = await imp("@/const.js")

const obs = new OBSDriver()

export const setActiveScene = (index, {
  name,
  sceneName
}) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.setCurrentProgramScene(sceneName)
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let currentScene = null
      try {
        currentScene = await obs.getCurrentProgramScene()
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
        }
      }
      const background = isEqual(currentScene, sceneName) ? 'green' : 'black'
      return {
        "text": `${this.name}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

export const virtualCameraToggle = (index, {
  name
}) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.toggleVirtualCam()
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let isActive = null
      try {
        isActive = await obs.getVirtualCamStatus()
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
          "isActive": false,
        }
      }
      const background = isActive ? 'green' : 'black'
      return {
        "isActive": isActive,
        "text": `${this.name}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
      "isActive": false,
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

export const streamToggle = (index, {
  name
}) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.toggleStream()
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let status = null
      try {
        status = await obs.getStreamStatus()
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
        }
      }
      const background = status.outputActive ? 'green' : 'black'
      const timecode = status.outputActive ? `\n ${status.outputTimecode.slice(0, -4)}` : ""
      return {
        "text": `${this.name}${timecode}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}

export const sourceToggle = (index, {
  name,
  sourceName,
}) => {
  async function onClick() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      try {
        await obs.setSourceEnabled(sourceName, this.data ? !this.data.isActive : false)
      } catch (er) {
        return
      }
      this.refresh()
    }
  }

  async function updateData() {
    const conn = await obs.establishConnection()
    if (conn == STATES.connected) {
      let isActive = null
      try {
        isActive = (await obs.getSourceEnabled(sourceName))
      } catch (er) {
        return {
          "text": `${this.name}`,
          "background": "grey",
          "isActive": false,
        }
      }
      const background = isActive ? 'green' : 'black'
      return {
        "isActive": isActive,
        "text": `${this.name}`,
        background
      }
    }

    return {
      "text": `${this.name}`,
      "background": "grey",
      "isActive": false,
    }
  }

  return new Key(index, name, {
    updateData,
    onClick,
  })
}
