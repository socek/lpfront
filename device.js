const { sleep } = require("./utils.js")
const { device } = require("./const.js")

const pages = require("./configuration.js")

const STATES = {
  notConnected: 1,
  connecting: 2,
  connected: 3,
}

let updateKnobsTask = null

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
    pages.init(device)
    await pages.lightButtons()
    await pages.drawPage()
    updateKnobsTask = setInterval(async() => {
      await pages.drawLeftScreen()
      await pages.drawRightScreen()
    }, 100)
})

device.on('disconnect', (payload) => {
    console.log("Disconnect")
    if(payload) {
      console.log("\t", payload)
    }
    state.connected = STATES.notConnected
    if(updateKnobsTask) {
      clearInterval(updateKnobsTask)
      updateKnobsTask = null
    }
})

device.on('down', async ({ id }) => {
    if(id.startsWith("knob")) {
      await pages.clickKnob(id)
      return
    } else if (id == "circle") {
      console.log("Live long and prosper")
    } else {
      await pages.changePage(id)
    }
})

device.on('rotate', async ({ id, delta }) => {
    await pages.changeKnob(id, delta)
    return
})

device.on('touchstart', async (payload) => {
  const target = payload.changedTouches[0].target
  if( target.screen === "center" ) {
    await pages.hoverKey(target.key)
  }
})

device.on('touchend', async (payload) => {
  const target = payload.changedTouches[0].target
  await pages.touchEnd(target.key)
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
