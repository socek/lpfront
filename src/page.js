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

export default class Page {
  constructor(index) {
    this.device = null
    this.index = index
    this.keys = {}
    this.knobs = {}
  }

  async setDevice(device) {
    this.device = device
    for (const [index, key] of entries(this.keys)) {
      key.setDevice(device)
    }
    for (const [index, knob] of entries(this.knobs)) {
      knob.setDevice(device)
    }
  }

  async addKey(key) {
    this.keys[key.index] = key
    if (this.device) {
      key.setDevice(device)
    }
  }

  async addKnob(knob) {
    this.knobs[knob.index] = knob
    if (this.device) {
      knob.setDevice(device)
    }
  }

  async refreshPage() {
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
        for (const index of screenKnobs[screen]) {
          const knob = this.knobs[index]
          if (knob) {
            knob._redraw(ctx)
          }
        }
      }
      this.device.drawScreen(screen, drawScreen)
    }
  }

  async hoverKey(index) {
    const key = this.keys[index]
    if (key) {
      await key.onHover()
    }
  }

  async hoverOff(index) {
    const key = this.keys[index]
    if (key) {
      await key.onHoverOff()
    }
  }

  async click(index) {
    const key = this.keys[index]
    if (key) {
      await key.onClick()
    }
  }

  async changeKnob(id, delta) {
    const knob = this.getKnobById(id)
    if (knob) {
      knob.onChange(delta)
      await this.refreshPage()
    }
  }

  getKnobById(name) {
    const index = knobsTranslator[name]
    return this.knobs[index]
  }
}
