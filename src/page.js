const entries = Object.entries
const knobsTranslator = {
  "knobTL": 0,
  "knobCL": 1,
  "knobBL": 2,
  "knobTR": 3,
  "knobCR": 4,
  "knobBR": 5,
}
const screenKnobs = {
  'left': [0, 1, 2],
  'right': [3, 4, 5],
}

export default function Page(index) {
  this.device = null
  this.index = index
  this.keys = {}
  this.knobs = {}

  this.init = async(device) => {
    this.device = device
    for (const [index, key] of entries(this.keys)) {
      key.setDevice(device)
    }
    for (const [index, knob] of entries(this.knobs)) {
      knob.setDevice(device)
    }
  }

  this.addKey = (key) => {
    this.keys[key.index] = key
    if (this.device) {
      key.setDevice(device)
    }
  }

  this.addKnob = (knob) => {
    this.knobs[knob.index] = knob
    if (this.device) {
      knob.setDevice(device)
    }
  }

  this.refreshPage = async() => {
    for (const [index, key] of entries(this.keys)) {
      await key.refresh()
    }
    const toRefresh = new Set()
    for (const [index, knob] of entries(this.knobs)) {
      await knob.updateData()
      if (knob.isRefreshable()) {
        toRefresh.add(index < 3 ? 'left' : 'right')
      }
    }
    for (const screen of toRefresh) {
      const drawScreen = (ctx) => {
        for(const index of screenKnobs[screen]) {
          const knob = this.knobs[index]
          if(knob) {
            knob._redraw(ctx)
          }
        }
      }
      this.device.drawScreen(screen, drawScreen)
    }
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
