const canvases = [60 / 2, 270 / 3 / 2]

function Knob(index, name, getKnobText, click, change, draw) {
  this.index = index
  this.name = name
  this.draw = draw || ((ctx) => {
    ctx.font = "11px consolas";
    ctx.textBaselin = "middle";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(this._text, canvases[0], this.getKnobDrawCenter())
  })
  this.getKnobText = getKnobText || (() => this.name)

  this.getKnobDrawCenter = () => 90 * (this.index < 3 ? this.index : this.index - 3) + 45

  this.updateText = async() => {
    this._text = await this.getKnobText()
  }

  this.change = change || (async() => {})
  this.click = click || (async() => {})
}

module.exports = Knob
