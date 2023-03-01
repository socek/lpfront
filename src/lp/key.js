const {
  DeviceBased
} = await imp("@src/lp/base.js")
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const keyHoverTimeout = 100

const size = [90 / 2, 90 / 2]

export default class Key extends DeviceBased {
  constructor(index, name, {
    updateData,
    onClick,
  }) {
    super(index, name, {
      updateData
    })
    this.onClick = (onClick || (() => {})).bind(this)
    this._onHoverMade = null
  }

  async onHover() {
    this.forceRedraw("blue")
    this._onHoverMade = Date.now()
  }

  async onHoverOff() {
    const millis = Date.now() - this._onHoverMade

    if(millis < keyHoverTimeout) {
      await sleep(keyHoverTimeout - millis)
    }
    this.forceRedraw()
  }

  async forceRedraw(forceBackground) {
    await this.device.drawKey(this.index, (ctx) => this._redraw(ctx, forceBackground))
  }

  _redraw(ctx, forceBackground) {
    const background = forceBackground || (this.data && this.data.background) || 'black'
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
