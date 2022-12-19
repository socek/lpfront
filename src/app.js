const {
  endAllConnections
} = await imp("@src/plugins/obs/external.js")
const toml = await imp("toml", true)
const {
  access,
  entries
} = await imp('@src/utils.js')
const fs = await imp('fs/promises', true)
const PageContainer = await imp("@src/lp/page_container.js", true)
const Page = await imp("@src/lp/page.js", true)

const exitEvents = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"]
const configurationPath = "/home/socek/.mylp.toml"

const defaultPlugins = [
  "@src/plugins/pulseaudio/plugin.js",
  "@src/plugins/spotify/plugin.js",
  "@src/plugins/i3/plugin.js",
  "@src/plugins/exec/plugin.js",
  "@src/plugins/obs/plugin.js",
  "@src/plugins/amixer/plugins.js"
]

export default class Application {
  devices = null
  plugins = null
  configuration = null

  pages = null
  avalible = null

  constructor() {
    this.devices = []
    for (const event of exitEvents) {
      process.on(event, this.cleanExit.bind(this)) // catch ctrl-c
    }
    this.plugins = []
    this.pages = new PageContainer()
    this.avalible = {
      keys: {},
      knobs: {},
    }
  }

  addPlugin(plugin) {
    this.plugins.push(plugin)
    plugin.init(this)
    for (const [name, key] of entries(plugin.getAvalibleKeys())) {
      this.avalible.keys[`${plugin.name}:${name}`] = key
    }
    for (const [name, knob] of entries(plugin.getAvalibleKnobs())) {
      this.avalible.knobs[`${plugin.name}:${name}`] = knob
    }
  }

  addDevice(device) {
    this.devices.push(device)
    device.setPageContainer(this.pages)
  }

  async readConfiguration() {
    let result = null

    try {
      await access(configurationPath)
    } catch (er) {
      console.log("No configuration found...")
      this.configuration = {}
      return
    }

    const configurationData = await fs.readFile(configurationPath, {
      encoding: 'utf8'
    })
    this.configuration = toml.parse(configurationData)
  }

  async applyConfiguration() {
    await this._applyPlugins()

    for (const [pIndex, pageConfiguration] of entries(this.configuration.pages || [])) {
      const page = new Page(pIndex)
      for (const [kIndex, keyConfiguration] of entries(pageConfiguration.keys)) {
        const keyFunction = this.avalible.keys[keyConfiguration.type]
        if (!keyFunction) {
          console.warn(`Not avalible plugin for: ${keyConfiguration.name} ${keyConfiguration.type}`)
          continue
        }

        page.addKey(keyFunction(kIndex - 1, keyConfiguration))
      }

      for (const [kIndex, knobConfiguration] of entries(pageConfiguration.knobs || [])) {
        const knobFunction = this.avalible.knobs[knobConfiguration.type]
        if (!knobFunction) {
          console.warn(`Not avalible plugin for: ${knobConfiguration.type}`)
          continue
        }
        page.addKnob(knobFunction(kIndex - 1, knobConfiguration))
      }

      this.pages.addPage(pIndex, page)
    }
  }

  async cleanExit() {
    console.log("\rExiting...")
    for (const plugin of this.plugins) {
      await plugin.onExit()
    }
    await endAllConnections()
    for (const device of this.devices) {
      await device.beforeExit()
    }
    process.exit()
  }

  async _applyPlugins() {
    let pluginsPaths = (this.configuration.app && this.configuration.app.plugins) || []
    pluginsPaths = pluginsPaths.concat(defaultPlugins)

    for(const pluginPath of pluginsPaths) {
      const pluginCls = await imp(pluginPath, true)
      const plugin = new pluginCls()
      this.addPlugin(plugin)
      console.log(`Plugin initialized: ${plugin.name}`)
    }
    console.log("Plugin initalization completed...")
  }

  async start(drivers) {
    await this.readConfiguration()
    await this.applyConfiguration()
    for(const driver of drivers) {
      this.addDevice(driver)
    }
    for(const driver of drivers) {
      driver.connect()
    }
  }
}
