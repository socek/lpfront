const {
  LoupedeckDevice
} = await imp('loupedeck')
const {
  STATES
} = await imp("@/src/consts.js")

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class LoupedeckDriver {
  state = STATES.notConnected
  backgroundCheckTask = null
  pageContainer = null

  constructor() {
    this.device = new LoupedeckDevice({
      autoConnect: false
    })
    this.device.on('connect', this.onConnected.bind(this))
    this.device.on('disconnect', this.onDisconnect.bind(this))
    this.device.on('down', this.onDown.bind(this))
    this.device.on('rotate', this.onRotate.bind(this))
    this.device.on('touchstart', this.onTouchstart.bind(this))
    this.device.on('touchend', this.onTouchend.bind(this))
  }

  setPageContainer(pageContainer) {
    this.pageContainer = pageContainer
    this.pageContainer.setDevice(this.device)
  }

  async connect() {
    this.device.connect()
    this.state = STATES.connecting
    console.log("Sleeping for 1s...")
    await sleep(1000)
    if (this.state === STATES.connecting) {
      console.info("Not connected, retrying...")
      this.device.close()
      this.device.connect()
      return
    }
    console.info("Connection established, not retrying...")
  }

  async onConnected() {
    console.info('Connection successful!')
    this.state = STATES.connected

    await this.device.setBrightness(1)
    await this.pageContainer.lightButtons()
    await this.pageContainer.refreshPage(true)
    if (!this.backgroundCheckTask) {
      this.backgroundCheckTask = setInterval(async() => {
        await this.pageContainer.refreshPage()
      }, 100)
    }
  }
  async onDisconnect(payload) {
    console.log("Disconnect")
    if (payload) {
      console.log("\t", payload)
    }
    this.state = STATES.notConnected
    if (this.backgroundCheckTask) {
      clearInterval(this.backgroundCheckTask)
      this.backgroundCheckTask = null
    }
  }
  async onDown({
    id
  }) {
    if (id.startsWith("knob")) {
      await this.pageContainer.clickKnob(id)
      return
    } else if (id == "circle") {
      console.log("Live long and prosper")
      await this.pageContainer.refreshPage(true)
    } else {
      await this.pageContainer.changePage(id)
    }
  }
  async onRotate({
    id,
    delta
  }) {
    await this.pageContainer.changeKnob(id, delta)
  }
  async onTouchstart(payload) {
    for (const touch of payload.changedTouches) {
      if (touch.target.screen === "center") {
        await this.pageContainer.touchStart(touch.target.key)
      }
    }
  }
  async onTouchend(payload) {
    for (const touch of payload.changedTouches) {
      if (touch.target.screen === "center") {
        await this.pageContainer.touchEnd(touch.target.key)
      }
    }
  }

  async beforeExit() {
    if (this.state == STATES.connected) {
      await this.device.setBrightness(0.1)
      await this.device.close()
    }
  }
}
