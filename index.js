import "./imports.js"

const Application = await imp("@src/app.js", true)
const LpDriver = await imp("@src/driver.js", true)

const start = async() => {
  const app = new Application()
  app.start([new LpDriver()])
}
start()
