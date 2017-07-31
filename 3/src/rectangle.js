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
    this.zMatrix = [];

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
    this.ctx.lineWidth = 1;

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
  }

  update() {
    let rotation = this._timeRotation();

    let a = Math.PI * Math.sin(rotation[0]) * 20;
    let b = Math.PI * Math.sin(rotation[1]) * 20;

    this.zMatrix = [
      Math.cos(a), -Math.sin(b) - .1,    0, 0,
      Math.sin(a),  Math.cos(b) - .2,    0, 0,
           0,       0,    1,    0,
           0,       0,    0,    1
    ];
  }

  _mouseRotation() {
    return [
      Math.sin((dimensions.width - mouse().x) / (dimensions.width / 10)) / 50,
      Math.sin((dimensions.height - mouse().y) / (dimensions.height / 10)) / 50
    ]
  }

  _timeRotation() {
    let divisor = ('ontouchstart' in window) ? 10 : 5;
    let time = Date.now() * (.2 * (this.delay + 1));

    return [
      ((Math.sin(time / 5000) + 1) / divisor) / 10,
      ((Math.cos(time / 5000) + 1) / divisor) / 10
    ];
  }
}