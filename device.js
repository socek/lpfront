const { HAPTIC } = require('loupedeck')
const { sleep } = require("./utils.js")
const { device } = require("./const.js")
const { updateVolume, toggleMute, changeVolume } = require("./volumes.js")
const { updateKey, hoverKey, downKey } = require("./src/drawer.js")
const { previousSong, nextSong, playPause } = require("./src/spotify.js")

const STATES = {
  notConnected: 1,
  connecting: 2,
  connected: 3,
}

const state = {
    connection: STATES.notConnected,
}

const ensureConnectionWorker = async () => {
  console.log("Sleeping...")
  await sleep(1000)
  if (state.connection == STATES.connecting) {
      console.info("Not connected, retrying...")
      device.close()
      device.connect()
      return
  }
  if (state.connection == STATES.connected) {
    console.info("Connection established, not retrying...")
  }
}

device.on('connect', async () => {
    console.info('Connection successful!')
    state.connection = STATES.connected
    await device.setBrightness(1)
    updateVolume()
    updateKey()
    await device.setButtonColor({ id : "1", color : "#0066ff" })
})

device.on('disconnect', (payload) => {
    console.log("Disconnect")
    if(payload) {
      console.log("\t", payload)
    }
    state.connected = STATES.notConnected
})

device.on('down', ({ id }) => {
    if(id.startsWith("knob")) {
      toggleMute(id)
      return
    }
    console.info(`Button pressed: ${id}`)
})

device.on('rotate', ({ id, delta }) => {
    changeVolume(id, delta)
    return
})

device.on('touchstart', async (payload) => {
  const target = payload.changedTouches[0].target
  if( target.screen === "center" ) {
    await hoverKey(target.key)
  }
})

device.on('touchend', async (payload) => {
  const target = payload.changedTouches[0].target
  downKey(target.key)
  updateKey()
  if (target.key == 0 ) {
    await previousSong()
    return
  }
  if (target.key == 1 ) {
    await playPause()
    return
  }
  if (target.key == 2 ) {
    await nextSong()
    return
  }
  console.info(`Screen pressed: ${target.key || target.screen}`)
})

const establishConnection = async () => {
  console.log("Starting connection...")
  state.connection = STATES.connecting
  ensureConnectionWorker()
  device.connect()
}

const beforeExit = async () => {
  if(state.connection == STATES.connected) {
      await device.setBrightness(0.1)
      await device.close()
  }
}

module.exports = {
  device,
  establishConnection,
  beforeExit,
  ensureConnectionWorker,
 }
