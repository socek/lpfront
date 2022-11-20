const entries = Object.entries

export default function PageContainer() {
  this.device = null
  this.pages = {}
  this.currentPage = 1

  this.init = async (device) => {
    this.device = device
    for (const [index, page] of entries(this.pages)) {
      await page.init(this.device)
    }
  }

  this.addPage = (index, page) => {
    this.pages[index] = page
  }

  this.refreshPage = async() => {
    const page = this.pages[this.currentPage]
    await page.refreshPage()
  }

  this.clickKnob = async(id) => {
    const page = this.pages[this.currentPage]
    const knob = page.getKnobById(id)
    knob.onClick(knob)
    await page.refreshPage()
  }

  this.changeKnob = async(id, delta) => {
    const page = this.pages[this.currentPage]
    const knob = page.getKnobById(id)
    knob.onChange(delta)
    await page.refreshPage()
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
    await this.refreshPage()
    await this.lightButtons()
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
