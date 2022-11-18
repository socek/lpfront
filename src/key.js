const canvases = [90 / 2, 90 / 2]

function Key(index, name, click, draw, getButtonText) {
  this.index = index
  this.name = name
  this.background = "black"
  this.draw = draw || ((ctx, forceBackground) => {
    const background = forceBackground || this.background
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, 90, 90)
    }
    ctx.font = "14px consolas"
    ctx.textBaselin = "middle"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(this._text, canvases[0], canvases[1])
  })
  this.hover = (ctx) => {
    this.draw(ctx, "yellow")
  }
  this.hoverOff = (ctx) => {
    this.draw(ctx)
  }
  this.getButtonText = getButtonText || (() => this.name)

  this.click = click || (() => {})

  this.updateText = async() => {
    this._text = await this.getButtonText()
  }
}

module.exports = Key
