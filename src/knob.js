const canvases = [60 / 2, 270 / 3 / 2]

export default class Knob {
  constructor(index, {
    name,
    getText,
    onClick,
    onChange,
    draw,
  }) {
    this.index = index
    this.name = name
    this.draw = draw || ((ctx) => {
      ctx.font = "11px consolas";
      ctx.textBaseline = "top";
      ctx.fillStyle = "white";
      ctx.textAlign = "center"
      ctx.fillText(this._text, canvases[0], this.getKnobDrawCenter(ctx))
    })
    this.getText = getText || (() => this.name)

    this.onChange = onChange || (async() => {})
    this.onClick = onClick || (async() => {})
  }

  getKnobDrawCenter(ctx) {
    const height = ctx.measureText(this._text)["emHeightDescent"]
    const drawHeight = canvases[1] - (height / 2)
    return 90 * (this.index < 3 ? this.index : this.index - 3) + drawHeight
  }

  async updateText() {
    this._text = await this.getText()
  }

}
