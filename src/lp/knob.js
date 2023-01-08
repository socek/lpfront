const {
  DeviceBased
} = await imp("@src/lp/base.js")

const canvases = [60 / 2, 270 / 3 / 2]
const rectMarginTop = 15
const rectMarginBottom = 30
const rectHigh = 90
const radius = 15;

export class Knob extends DeviceBased {
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

const degreesToRadians = (deg) => {
  return (deg/180) * Math.PI;
}

const percentToRadians = (percentage) => {
  // convert the percentage into degrees
  var degrees = percentage * 360 / 100;
  // and so that arc begins at top of circle (not 90 degrees) we add 270 degrees
  return degreesToRadians(degrees + 270);
}

export class CircleKnob extends Knob {
  getPercentageText() {
    if(!this.data || !this.data.state) {
      return 'off';
    }

    if(this.data.muted) {
      return 'muted'
    }

    return this.data.percentage + "%";
  }

  _redraw(ctx, forceBackground) {
    const {top, left, bottom, right} = this.getKnobDrawLeftCorner()

    const background = forceBackground || (this.data && this.data.background) || 'black'
    ctx.fillStyle = background
    ctx.fillRect(left, top, right, bottom)

    const percentage = this.data.percentage || 0;
    const x  = 30;
    const y = this.getKnobDrawCenter(ctx);
    const startAngle = percentToRadians(0);
    const endAngle = percentToRadians(percentage);

    let counterClockwise = true;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    ctx.lineWidth = 15;
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // set to false so that we draw the actual percentage
    counterClockwise = false;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    ctx.lineWidth = 15;
    ctx.strokeStyle = 'green';
    ctx.stroke();

    ctx.font = "11px consolas";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    const text = `${this.getText()}\n${this.getPercentageText()}`;
    ctx.fillText(text, canvases[0], this.getKnobDrawCenter(ctx));
  }
}
