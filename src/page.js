const entries = Object.entries
const canvases = {
  key: [90 / 2, 90 / 2],
  sides: [60 / 2, 270 / 3 / 2],
}
const knobsTranslator = {
  "knobTL": 0,
  "knobCL": 1,
  "knobBL": 2,
  "knobTR": 3,
  "knobCR": 4,
  "knobBR": 5,
}

function Page(index) {
  this.device = null
  this.index = index
  this.keys = {}
  this.knobs = {}

  this.init = (device) => {
    this.device = device
  }

  this.addKey = (key) => {
    this.keys[key.index] = key
  }

  this.addKnob = (knob) => {
    this.knobs[knob.index] = knob
  }

  this.drawKeys = async() => {
    for (let index = 0; index < 12; index++) {
      this.device.drawKey(index, (ctx) => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 90, 90);
      })
    }
    for (const [index, key] of entries(this.keys)) {
      await key.updateText()
      this.device.drawKey(index, key.hoverOff)
    }
    await this.drawLeftScreen()
    await this.drawRightScreen()
  }

  this.getLeftKnobs = () => {
    const knobs = []
    if (this.knobs[0]) {
      knobs.push(this.knobs[0])
    }
    if (this.knobs[1]) {
      knobs.push(this.knobs[1])
    }
    if (this.knobs[2]) {
      knobs.push(this.knobs[2])
    }
    return knobs
  }

  this.drawLeftScreen = async() => {
    const knobs = this.getLeftKnobs()
    for (const knob of knobs) {
      await knob.updateText()
    }
    this.device.drawScreen("left", (ctx) => {
      for (const knob of knobs) {
        knob.draw(ctx)
      }
    })
  }

  this.getRightKnobs = () => {
    const knobs = []
    if (this.knobs[3]) {
      knobs.push(this.knobs[3])
    }
    if (this.knobs[4]) {
      knobs.push(this.knobs[4])
    }
    if (this.knobs[5]) {
      knobs.push(this.knobs[5])
    }
    return knobs
  }

  this.drawRightScreen = async() => {
    const knobs = this.getRightKnobs()
    for (const knob of knobs) {
      await knob.updateText()
    }
    this.device.drawScreen("right", (ctx) => {
      for (const knob of knobs) {
        knob.draw(ctx)
      }
    })
  }

  this.hoverKey = async(index) => {
    const key = this.keys[index]
    if (key) {
      this.device.drawKey(index, key.hover)
    }
  }

  this.hoverOff = async(index) => {
    const key = this.keys[index]
    if (key) {
      await key.updateText()
      this.device.drawKey(index, key.hoverOff)
    }
  }

  this.click = async (index) => {
    const key = this.keys[index]
    if (key) {
      await key.click()
    }
  }

  this.getKnobById = (name) => {
    const index = knobsTranslator[name]
    return this.knobs[index]
  }
}

function Key(index, name, click, draw, getButtonText) {
  this.index = index
  this.name = name
  this.background = "black"
  this.draw = draw || ((ctx, forceBackground) => {
    const background = forceBackground || this.background
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, 90, 90)
    }
    ctx.font = "14px consolas"
    ctx.textBaselin = "middle"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(this._text, canvases.key[0], canvases.key[1])
  })
  this.hover = (ctx) => {
    this.draw(ctx, "yellow")
  }
  this.hoverOff = (ctx) => {
    this.draw(ctx)
  }
  this.getButtonText = getButtonText || (() => this.name)

  this.click = click || (() => {})

  this.updateText = async() => {
    this._text = await this.getButtonText()
  }
}

function Knob(index, name, getKnobText, click, change, draw) {
  this.index = index
  this.name = name
  this.draw = draw || ((ctx) => {
    ctx.font = "11px consolas";
    ctx.textBaselin = "middle";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(this._text, canvases.sides[0], this.getKnobDrawCenter())
  })
  this.getKnobText = getKnobText || (() => this.name)

  this.getKnobDrawCenter = () => 90 * (this.index < 3 ? this.index : this.index - 3) + 45

  this.updateText = async() => {
    this._text = await this.getKnobText()
  }

  this.change = change || (async() => {})
  this.click = click || (async() => {})
}

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

module.exports = {
  PageContainer,
  Page,
  Key,
  Knob
}
