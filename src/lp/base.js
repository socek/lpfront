const {
  isEqual
} = await imp('lodash', true)

export class DeviceBased {
  constructor(index, name, {updateData}) {
    this.index = index
    this.name = name
    this.data = {}
    this._last_redraw = null
    this._last_update = null
    this.device = null
    this._updateData = updateData || (async() => null)
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
    if (!isEqual(this.data, newData)) {
      this.data = newData
      this._last_update = Date.now()
    }
  }

  isRefreshable() {
    return !this._last_redraw || this._last_redraw != this._last_update
  }

  async refresh() {
    await this.updateData()
    if (!this.isRefreshable()) {
      return
    }
    await this.forceRedraw()
    this._last_redraw = this._last_update = Date.now()
  }

  async forceRedraw() {}
}
