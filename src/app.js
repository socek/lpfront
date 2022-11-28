const {endAllConnections} = await imp("@src/externals/obs.js")

export default class Application {
  devices = null
  constructor() {
    this.devices = []
    process.on('SIGINT', this.cleanExit.bind(this)) // catch ctrl-c
    process.on('SIGTERM', this.cleanExit.bind(this)) // catch kill
  }

  addDevice(device) {
    this.devices.push(device)
  }

  async cleanExit() {
    console.log("\rExiting...")
    await endAllConnections()
    for (const device of this.devices) {
      await device.beforeExit()
    }
    process.exit()
  }
}
