const entries = Object.entries
function PageContainer() {
  this.device = null
  this.pages = {}
  this.currentPage = 1

  this.init = (device) => {
    this.device = device
    for (const [index, page] of entries(this.pages)) {
      page.init(this.device)
    }
  }

  this.addPage = (index, page) => {
    this.pages[index] = page
  }

  this.drawPage = async() => {
    const page = this.pages[this.currentPage]
    await page.drawKeys()
    await page.drawLeftScreen()
    await page.drawRightScreen()
    await this.lightButtons()
  }

  this.drawLeftScreen = async() => {
    const page = this.pages[this.currentPage]
    await page.drawLeftScreen()
  }

  this.drawRightScreen = async() => {
    const page = this.pages[this.currentPage]
    await page.drawRightScreen()
  }

  this.clickKnob = async(id) => {
    const page = this.pages[this.currentPage]
    const knob = page.getKnobById(id)
    knob.click(knob)
    await this.drawLeftScreen()
    await this.drawRightScreen()
  }

  this.changeKnob = async(id, delta) => {
    const page = this.pages[this.currentPage]
    const knob = page.getKnobById(id)
    knob.change(delta)
    await this.drawLeftScreen()
    await this.drawRightScreen()
  }

  this.hoverKey = async(index) => {
    const page = this.pages[this.currentPage]
    await page.hoverKey(index)
  }

  this.touchEnd = async(index) => {
    const page = this.pages[this.currentPage]
    await page.click(index)
    await page.hoverOff(index)
  }

  this.changePage = async(index) => {
    if (!this.pages[index]) {
      console.info(`Page ${index} not exists`)
      return
    }
    this.currentPage = index
    this.drawPage()
  }

  this.lightButtons = async() => {
    for (let index = 1; index < 7; index++) {
      const page = this.pages[index]
      if (page && index == this.currentPage) {
        this.device.setButtonColor({
          id: `${index}`,
          color: "#0066ff"
        })
      } else if (page) {
        this.device.setButtonColor({
          id: `${index}`,
          color: "#ff6600"
        })
      } else {
        this.device.setButtonColor({
          id: `${index}`,
          color: "black"
        })
      }
    }
  }
}

module.exports = PageContainer
