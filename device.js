const { HAPTIC } = require('loupedeck')
const { sleep } = require("./utils.js")
const { device } = require("./const.js")
const { updateVolume, toggleMute, changeVolume } = require("./volumes.js")
const { updateKey, hoverKey, downKey } = require("./src/drawer.js")
const { previousSong, nextSong, playPause } = require("./src/spotify.js")
const { goToWorkspace } = require("./src/i3.js")

const { firstPage } = require("./configuration.js")

const STATES = {
  notConnected: 1,
  connecting: 2,
  connected: 3,
}

page = firstPage(device)

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
    await page.drawAll()
    await device.setButtonColor({ id : "1", color : "#0066ff" })
    updateKnobsTask = setInterval(async() => {
      await page.drawLeftScreen()
      await page.drawRightScreen()
    }, 1000)
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
      await page.getKnobById(id).click()
      await page.drawLeftScreen()
      await page.drawRightScreen()
      return
    }
    console.info(`Button pressed: ${id}`)
})

device.on('rotate', async ({ id, delta }) => {
    await page.getKnobById(id).change(delta)
    await page.drawLeftScreen()
    await page.drawRightScreen()
    return
})

device.on('touchstart', async (payload) => {
  const target = payload.changedTouches[0].target
  if( target.screen === "center" ) {
    // await hoverKey(target.key)
    page.hoverKey(target.key)
  }
})

device.on('touchend', async (payload) => {
  const target = payload.changedTouches[0].target
  page.drawKey(target.key)
  page.click(target.key)
  // downKey(target.key)
  // updateKey()
  // if (target.key == 0 ) {
  //   await previousSong()
  //   return
  // }
  // if (target.key == 1 ) {
  //   await playPause()
  //   return
  // }
  // if (target.key == 2 ) {
  //   await nextSong()
  //   return
  // }
  // if (target.key == 4) {
  //   await goToWorkspace("w")
  //   return
  // }
  // if (target.key == 5) {
  //   await goToWorkspace("s")
  //   return
  // }
  // if (target.key == 6) {
  //   await goToWorkspace("c")
  //   return
  // }
  // if (target.key == 7) {
  //   await goToWorkspace("q")
  //   return
  // }
  // if (target.key == 8) {
  //   await goToWorkspace("a")
  //   return
  // }
  // if (target.key == 9) {
  //   await goToWorkspace("e")
  //   return
  // }
  // console.info(`Screen pressed: ${target.key || target.screen}`)
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
