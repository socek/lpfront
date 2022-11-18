const canvases = [90 / 2, 90 / 2]

export default class Key {
  constructor(index, {
    name,
    onClick,
    draw,
    getText
  }) {
    this.index = index
    this.name = name
    this.background = "black"
    this.draw = draw || ((ctx, forceBackground) => {
      const background = forceBackground || this.background
      ctx.fillStyle = background
      ctx.fillRect(0, 0, 90, 90)
      ctx.font = "14px consolas"
      ctx.textBaseline = "top"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      const height = ctx.measureText(this._text)["emHeightDescent"]
      const drawHeight = canvases[1] - (height / 2)
      ctx.fillText(this._text, canvases[0], drawHeight)
    })

    this.getText = getText || (() => this.name)
    this.onClick = onClick || (() => {})
  }

  hover(ctx) {
    this.draw(ctx, "yellow")
  }

  hoverOff(ctx) {
    this.draw(ctx)
  }

  async updateText() {
    this._text = await this.getText()
  }
}
