const OBSWebSocket = await imp('obs-websocket-js', true)
import {
  log_def_to_db,
  log_db_to_def
} from "./db.js"
const {
  STATES
} = await imp("@/src/consts.js")


const _drivers = []

export class OBSDriver {
  state = STATES.notConnected

  constructor() {
    this.obs = new OBSWebSocket()
    _drivers.push(this)
  }

  async establishConnection() {
    if (this.state === STATES.notConnected) {
      this.state = STATES.connecting
      try {
        await this.obs.connect('ws://127.0.0.1:4455', '7NvMa1NwRTCssaXI')
      } catch (error) {
        this.state = STATES.notConnected
        return this.state
      }
      console.info("Connection to obs established")
      this.state = STATES.connected
    } else {
      try {
        await this.obs.call('GetVersion')
      } catch (er) {
        console.warn("Connection to obs lost...")
        this.state = STATES.notConnected
        return this.state
      }
    }
    return this.state
  }

  async endConnection() {
    if (this.state === STATES.connected) {
      await this.obs.disconnect()
      this.state = STATES.notConnected
    }
  }

  async getCurrentProgramScene() {
    const result = await this.obs.call('GetCurrentProgramScene')
    return result.currentProgramSceneName
  }

  async setCurrentProgramScene(sceneName) {
    return await this.obs.call('SetCurrentProgramScene', {
      sceneName
    });
  }

  async getSourceActive(sourceName) {
    return await this.obs.call('GetSourceActive', {
      sourceName
    })
  }

  async getSourceEnabled(sourceName, sceneName) {
    sceneName = sceneName || (await this.getCurrentProgramScene())
    let result = await this.obs.call("GetSceneItemId", {
      sceneName,
      sourceName
    })
    const sceneItemId = result.sceneItemId

    result = await this.obs.call("GetSceneItemEnabled", {
      sceneName,
      sceneItemId
    })
    return result.sceneItemEnabled
  }

  async setSourceEnabled(sourceName, sceneItemEnabled, sceneName) {
    sceneName = sceneName || (await this.getCurrentProgramScene())
    let result = await this.obs.call("GetSceneItemId", {
      sceneName,
      sourceName
    })
    const sceneItemId = result.sceneItemId
    return await this.obs.call("SetSceneItemEnabled", {
      sceneName,
      sceneItemId,
      sceneItemEnabled
    })
  }

  async getVirtualCamStatus() {
    const result = await this.obs.call("GetVirtualCamStatus")
    return result.outputActive
  }

  async toggleVirtualCam() {
    const result = await this.obs.call("ToggleVirtualCam")
    return result.outputActive
  }

  async getStreamStatus() {
    const result = await this.obs.call("GetStreamStatus")
    return result
  }

  async toggleStream() {
    const result = await this.obs.call("ToggleStream")
    return result.outputActive
  }

  async getVolume(inputName) {
    const result = await this.obs.call("GetInputVolume", {
      inputName
    })
    return log_db_to_def(result.inputVolumeDb)
  }

  async setVolume(inputName, percentage) {
    const inputVolumeDb = log_def_to_db(percentage)
    const result = await this.obs.call("SetInputVolume", {
      inputName,
      inputVolumeDb
    })
    return result
  }

  async getInputMute(inputName) {
    return (await this.obs.call("GetInputMute", {inputName})).inputMuted
  }

  async toggleInputMute(inputName) {
    return await this.obs.call("ToggleInputMute", {inputName})
  }
}

export const endAllConnections = async() => {
  for (const driver of _drivers) {
    await driver.endConnection()
  }
}
