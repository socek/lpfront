const {
  DeviceBased
} = await imp("@src/lp/base.js")

const canvases = [60 / 2, 270 / 3 / 2]
const rectMarginTop = 15
const rectMarginBottom = 30
const rectHigh = 90

export default class Knob extends DeviceBased {
  constructor(index, name, {
    updateData,
    onClick,
    onChange,
  }) {
    super(index, name, {
      updateData
    })
    this.onClick = (onClick || (() => {})).bind(this)
    this.onChange = (onChange || (() => {})).bind(this)
  }

  async forceRedraw(forceBackground) {
    console.log("paiting", this.name)
    const options = {
      id: this.index < 3 ? "left" : "right",
      autoRefresh: false
    }
    await this.device.drawCanvas(options, (ctx) => this._redraw(ctx, forceBackground))
  }

  _redraw(ctx, forceBackground) {
    const background = forceBackground || (this.data && this.data.background) || 'black'
    const {top, left, bottom, right} = this.getKnobDrawLeftCorner()
    ctx.fillStyle = background
    ctx.fillRect(left, top, right, bottom)
    ctx.font = "11px consolas";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    const text = this.getText()
    ctx.fillText(text, canvases[0], this.getKnobDrawCenter(ctx))
  }

  getKnobDrawCenter(ctx) {
    const height = ctx.measureText(this.getText())["emHeightDescent"]
    const drawHeight = canvases[1] - (height / 2)
    return 90 * (this.index < 3 ? this.index : this.index - 3) + drawHeight
  }

  getKnobDrawLeftCorner() {
    const top = rectMarginTop + (rectHigh * (this.index % 3))
    const left = 0
    const bottom = rectHigh - rectMarginBottom
    const right = 60
    return {top, left, bottom, right}
  }

}
