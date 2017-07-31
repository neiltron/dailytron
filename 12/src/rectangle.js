import Point from './point';
import dimensions from './dimensions';
import mouse from './mousemove';

let points = [];

for (var i = 0; i < 3; i++) {
  points.push([i, 0]);
  points.push([i, 1]);
  points.push([i + 1, 1]);
  points.push([i + 1, 0]);
}



export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.center = opts.center;
    this.ctx = opts.ctx;
    this.index = opts.index;
    this.total = opts.total;
    this.zMatrix = [];
    this.isLast = opts.total - 1 == opts.index;

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
    this.ctx.lineWidth = ('ontouchstart' in window) ? 1 : 2;
    this.ctx.beginPath();

    let point = this.points[0].get();

    this.ctx.moveTo(point[0] / 10 + this.center[0], 0);

    for (var i = 1; i < this.points.length; i += 1) {
      point = this.points[i].get();

      // this.ctx.lineTo(point[0] / 10 + this.center[0] + (this.width / 2) + 1, (dimensions.height / (this.points.length - 1)) * i);
      this.ctx.bezierCurveTo(
        point[0] / 10 + this.center[0], (dimensions.height / (this.points.length)) * i + (Math.cos(Date.now() / (i * 500)) * (this.index / 10)),
        point[0] / 10 + this.center[0], (dimensions.height / (this.points.length)) * i + (Math.sin(Date.now() / (i * 500)) * (this.index / 10)),
        point[0] / 10 + this.center[0], (dimensions.height / (this.points.length - 1)) * i
      );
    }

    this.ctx.stroke();
  }

  update() {
    let rotation = this._timeRotation();
    // let mouseRotation = this._mouseRotation();
    // let rotation = [1, 0];

    let x = Math.PI * .5 + (Math.PI * rotation[0]);
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
    let divisor = 10;
    let time = Date.now();

    return [
      ((time / 150) + this.index) / divisor,
      ((time / 300) + this.index) / divisor
    ];
  }
}