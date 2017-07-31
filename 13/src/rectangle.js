import Point from './point';
import dimensions from './dimensions';
import mouse from './mousemove';

let points = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0]
];

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.center = opts.center;
    this.ctx = opts.ctx;
    this.delay = opts.delay;
    this.total = opts.total;
    this.zMatrix = [];
    this.isLast = opts.total - 1 == opts.delay;

    this.points = this.getPoints();

    this.update();
  }

  getPoints() {
    let result = [];

    for (let i = 0, total = points.length; i < total; i++) {
      result.push(new Point(points[i], this));
    }

    return result;
  }

  draw() {
    let point = this.points[0].get();
    let center = [dimensions.width / 2, dimensions.height / 2];
    let total = 24;

    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    for (let i = 0; i < total; i++) {
      let angle = (360 / total) * i * (Math.PI / 180) + point[0] / 100;

      let startX = center[0];
      let startY = center[1];

      let cos = Math.cos(angle);
      let sin = Math.sin(angle);

      let x = cos + startX + 20 * this._mouseRotation()[0];
      let y = sin + startY + 20 * this._mouseRotation()[1];
      let endX = cos * dimensions.width + x;
      let endY = sin * dimensions.height + y;

      this.ctx.moveTo(x, y);
      this.ctx.lineTo(endX, endY);
    }

    this.ctx.stroke();

    this.ctx.save();
    this.ctx.transform(1, this._mouseRotation()[1] / 50, this._mouseRotation()[0] / 30, 1, 0, 0);

    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(20, 20, 20, .25)';

    this.ctx.lineWidth = ('ontouchstart' in window) ? 30 : 60;
    this.ctx.arc(dimensions.width / 2, dimensions.height / 2, this.width, 0, 2 * Math.PI)
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(20, 20, 20, .5)';
    this.ctx.lineWidth = ('ontouchstart' in window) ? 8 : 16;
    this.ctx.arc(dimensions.width / 2, dimensions.height / 2, this.width, 0, 2 * Math.PI)
    this.ctx.stroke();

    this.ctx.arc(dimensions.width / 2, dimensions.height / 2, this.width - this.ctx.lineWidth, 0, 2 * Math.PI)
    this.ctx.fillStyle = '#3f3f3f';
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    let rotation = this._timeRotation();
    // let rotation = [Math.PI, 0];

    // this.width += 1;

    let x = Math.PI * .5 * (this.delay / (this.total / 2)) + (Math.PI * rotation[0]);
    let y = (Math.PI * rotation[1]);

    this.zMatrix = [
      Math.cos(x), -Math.sin(x),    0, 0,
      Math.sin(x),  Math.cos(x),    0, 0,
           0,       0,    1,    0,
           0,       0,    0,    1
    ];
  }

  _mouseRotation() {
    return [
      (mouse().x / dimensions.width),
      (mouse().y / dimensions.height) - .5
    ]
  }

  _timeRotation() {
    let divisor = 10;
    let time = Date.now();

    return [
      ((time / 3000) + 1) / divisor,
      ((time / 5000) + 1) / divisor
    ];
  }
}