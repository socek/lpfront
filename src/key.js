const {DeviceBased} = await aimport("/src/lp/base.js")

const size = [90 / 2, 90 / 2]

export default class Key extends DeviceBased {
  constructor(index, name, {
    updateData,
    onClick,
  }) {
    super(index, name, {updateData})
    this.background = "black"
    this.onClick = (onClick || (() => {})).bind(this)
  }

  async onHover() {
    this.forceRedraw("blue")
  }

  async onHoverOff() {
    this.forceRedraw()
  }

  async forceRedraw(forceBackground) {
    await this.device.drawKey(this.index, (ctx) => this._redraw(ctx, forceBackground))
  }

  _redraw(ctx, forceBackground) {
    const background = forceBackground || this.background
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 90, 90)
    ctx.font = "14px consolas"
    ctx.textBaseline = "top"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    const text = this.getText()
    const height = ctx.measureText(text)["emHeightDescent"]
    const drawHeight = size[1] - (height / 2)
    ctx.fillText(text, size[0], drawHeight)
  }
}
