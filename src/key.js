import _ from 'lodash'

const size = [90 / 2, 90 / 2]

export default class Key {
  constructor(index, {
    name,
    onClick,
    updateData,
  }) {
    this.index = index
    this.name = name
    this.background = "black"
    this.data = {}
    this._last_draw = null
    this._last_update = null
    this.onClick = onClick || (() => {})
    this._updateData = updateData || (async() => null)
    this.device = null
  }

  setDevice(device) {
    this.device = device
  }

  getText() {
    if (this.data && this.data.text) {
      return this.data.text
    }
    return this.name
  }

  async updateData() {
    const newData = await this._updateData.bind(this)()
    if (!_.isEqual(this.data, newData)) {
      this.data = newData
      this._last_update = Date.now()
    }
  }

  isRefreshable() {
    return !this._last_draw || this._last_draw != this._last_update
  }

  async refresh() {
    await this.updateData()
    if (!this.isRefreshable()) {
      return
    }
    this.device.drawKey(this.index, (ctx) => this._redraw(ctx))
    this._last_draw = this._last_update = Date.now()
  }

  async onHover() {

    this.device.drawKey(this.index, (ctx) => this._redraw(ctx, "blue"))
  }

  async onHoverOff() {
    this.device.drawKey(this.index, (ctx) => this._redraw(ctx))
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
