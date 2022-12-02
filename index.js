import "./imports.js"

const Application = await imp("@src/app.js", true)
const LpDriver = await imp("@src/driver.js", true)

const PulseAudioPlugin = await imp("@src/plugins/pulseaudio/plugin.js", true)
const SpotifyPlugin = await imp("@src/plugins/spotify/plugin.js", true)
const I3Plugin = await imp("@src/plugins/i3/plugin.js", true)
const ExecPlugin = await imp("@src/plugins/exec/plugin.js", true)
const ObsPlugin = await imp("@src/plugins/obs/plugin.js", true)

const oldStart = async() => {
  const pageContainer = await imp("@/configuration.js", true)
  const app = new Application()
  const driver = new LpDriver()
  app.pages = pageContainer
  app.addDevice(driver)
  driver.connect()
}

const newStart = async() => {
  const driver = new LpDriver()
  const app = new Application()

  app.addPlugin(new PulseAudioPlugin())
  app.addPlugin(new SpotifyPlugin())
  app.addPlugin(new I3Plugin())
  app.addPlugin(new ExecPlugin())
  app.addPlugin(new ObsPlugin())

  await app.readConfiguration()
  await app.applyConfiguration()
  app.addDevice(driver)
  driver.connect()
}
// oldStart()
newStart()
