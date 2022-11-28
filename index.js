import "./imports.js"

const start = async() => {
  const Application = await imp("@src/app.js", true)
  const LpDriver = await imp("@src/driver.js", true)
  const pageContainer = await imp("@/configuration.js", true)

  const app = new Application()
  const driver = new LpDriver()
  app.addDevice(driver)
  driver.setPageContainer(pageContainer)
  driver.connect()
}
start()
