const entries = Object.entries
const knobsTranslator = {
  "knobTL": 0,
  "knobCL": 1,
  "knobBL": 2,
  "knobTR": 3,
  "knobCR": 4,
  "knobBR": 5,
}

export default function Page(index) {
  this.device = null
  this.index = index
  this.keys = {}
  this.knobs = {}

  this.init = (device) => {
    this.device = device
    for(const [index, key] of entries(this.keys)) {
      key.setDevice(device)
    }
  }

  this.addKey = (key) => {
    this.keys[key.index] = key
    if(this.device) {
      key.setDevice(device)
    }
  }

  this.addKnob = (knob) => {
    this.knobs[knob.index] = knob
  }

  this.refreshPage = async() => {
    for (const [index, key] of entries(this.keys)) {
      await key.refresh()
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
      await key.onHover()
    }
  }

  this.hoverOff = async(index) => {
    const key = this.keys[index]
    if (key) {
      await key.onHoverOff()
    }
  }

  this.click = async(index) => {
    const key = this.keys[index]
    if (key) {
      await key.onClick()
    }
  }

  this.getKnobById = (name) => {
    const index = knobsTranslator[name]
    return this.knobs[index]
  }
}
