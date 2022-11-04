const { HAPTIC } = require('loupedeck')
const { sleep } = require("./utils.js")
const { device } = require("./const.js")
const { updateVolume, toggleMute, changeVolume } = require("./volumes.js")

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
})

device.on('disconnect', (payload) => {
    console.log("Disconnect")
    if(payload) {
      console.log("\t", payload)
    }
    state.connected = STATES.notConnected
})

device.on('down', ({ id }) => {
    if(id == "knobTL") {
      toggleMute()
      return
    }
    console.info(`Button pressed: ${id}`)
})

// React to knob turns
device.on('rotate', ({ id, delta }) => {
    if (id == "knobTL") {
      changeVolume(delta)
      return
    }
    console.info(`Knob ${id} rotated: ${delta}`)
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
