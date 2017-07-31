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

    this.update();
    this.points = this.getPoints();
  }

  getPoints() {
    let result = [];

    for (let i = 0, total = points.length; i < total; i++) {
      result.push(new Point(points[i], this));
    }

    return result;
  }

  draw() {
    this.ctx.lineWidth = 2;

    let adjustmentY = dimensions.height / -8;
    let point = this.points[0].get();

    this.ctx.beginPath();
    this.ctx.moveTo(point[0] + this.center[0], point[1] + this.center[1]);

    for (var i = 0; i < this.points.length; i++) {
      point = this.points[i].get();

      this.ctx.lineTo(point[0] + this.center[0], point[1] + this.center[1]);
    }

    this.ctx.closePath();
    this.ctx.stroke();

    if (this.delay === 0) {
      this.ctx.fill()
    }
  }

  update() {
    let rotation = this._timeRotation();

    let x = Math.PI * .5 * (this.delay / (this.total / 2)) + (Math.PI * rotation[0]);
    let y = (Math.PI * rotation[1]);

    this.zMatrix = [
      Math.cos(x), -Math.sin(x),    0, 0,
      Math.sin(y),  Math.cos(y),    0, 0,
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
    let divisor = 5;
    let time = Date.now();

    return [
      ((time / 500) + 1) / divisor,
      ((time / 3000) + 1) / divisor
    ];
  }
}