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
function Page(device, index) {
  this.device = device
  this.index = index
  this.keys = {}
  this.knobs = {}

  this.addKey = (key) => {
    this.keys[key.index] = key
  }

  this.addKnob = (knob) => {
    this.knobs[knob.index] = knob
  }

  this.drawAll = async () => {
    for (const [index, key] of entries(this.keys)) {
      device.drawKey(index, key.draw)
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

  this.drawLeftScreen = async () => {
    const knobs = this.getLeftKnobs()
    for(const knob of knobs) {
      await knob.updateText()
    }
    device.drawScreen("left", (ctx) => {
      for(const knob of knobs) {
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

  this.drawRightScreen = async () => {
    const knobs = this.getRightKnobs()
    for(const knob of knobs) {
      await knob.updateText()
    }
    device.drawScreen("right", (ctx) => {
      for(const knob of knobs) {
        knob.draw(ctx)
      }
    })
  }

  this.hoverKey = async (index) => {
    if (this.keys[index]) {
      this.device.drawKey(index, this.keys[index].hover)
    }
  }

  this.drawKey = async (index) => {
    if (this.keys[index]) {
      this.device.drawKey(index, this.keys[index].draw)
    }
  }

  this.click = (index) => {
    if (this.keys[index]) {
      this.keys[index].click()
    }
  }

  this.getKnobById = (name) => {
    const index = knobsTranslator[name]
    return this.knobs[index]
  }
}

function Key(index, text, click, draw) {
  this.index = index
  this.text = text
  this.draw = draw || ((ctx) => {
    ctx.font = "14px consolas";
    ctx.textBaselin = "middle";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(this.text, canvases.key[0], canvases.key[1])
  })
  this.hover = (ctx) => {
    ctx.fillStyle = 'yellow'
    ctx.fillRect(0, 0, 90, 90)
    this.draw(ctx)
  }

  this.click = click || (() => {})
}

function Knob(index, name, getKnobText, click, change, draw) {
  this.index = index
  this.name = name
  this.draw = draw || ((ctx) => {
    ctx.font = "11px consolas";
    ctx.textBaselin = "middle";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(this._text, canvases.sides[0] , this.getKnobDrawCenter() )
  })
  this.getKnobText = getKnobText || (() => this.name)

  this.getKnobDrawCenter = () => 90 * (this.index < 3 ? this.index : this.index - 3) + 45

  this.updateText = async () => {
    this._text = await this.getKnobText(this)
  }

  this.change = change || (async () => {})
  this.click = click || (async () => {})
}

module.exports = {Page, Key, Knob}
