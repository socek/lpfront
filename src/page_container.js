const entries = Object.entries

export default class PageContainer {
  constructor() {
    this.device = null
    this.pages = {}
    this.currentPage = 1
  }

  async setDevice(device) {
    this.device = device
    for (const [index, page] of entries(this.pages)) {
      await page.setDevice(this.device)
    }
  }

  addPage(index, page) {
    this.pages[index] = page
    if (this.device) {
      page.setDevice(device)
    }
  }

  async refreshPage() {
    const page = this.pages[this.currentPage]
    await page.refreshPage()
  }

  async clickKnob(id) {
    const page = this.pages[this.currentPage]
    const knob = page.getKnobById(id)
    knob.onClick(knob)
    await page.refreshPage()
  }

  async changeKnob(id, delta) {
    const page = this.pages[this.currentPage]
    await page.changeKnob(id, delta)
  }

  async hoverKey(index) {
    const page = this.pages[this.currentPage]
    await page.hoverKey(index)
  }

  async touchEnd(index) {
    const page = this.pages[this.currentPage]
    await page.click(index)
    await page.hoverOff(index)
  }

  async changePage(index) {
    if (!this.pages[index]) {
      console.info(`Page ${index} not exists`)
      return
    }
    this.currentPage = index
    await this.refreshPage()
    await this.lightButtons()
  }

  async lightButtons() {
    for (let index = 1; index < 7; index++) {
      const page = this.pages[index]
      if (page && index == this.currentPage) {
        await this.device.setButtonColor({
          id: `${index}`,
          color: "#0066ff"
        })
      } else if (page) {
        await this.device.setButtonColor({
          id: `${index}`,
          color: "#ff6600"
        })
      } else {
        await this.device.setButtonColor({
          id: `${index}`,
          color: "black"
        })
      }
    }
  }
}

