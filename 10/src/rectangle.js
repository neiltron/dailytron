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

    for (var i = 0; i < this.points.length; i += 4) {
      let point = this.points[i].get();
      let point2 = this.points[i + 1].get();
      let point3 = this.points[i + 2].get();

      this.ctx.beginPath();

      this.ctx.moveTo(point[0] + this.center[0] + (this.width / 2), point[1] + this.center[1]);
      this.ctx.bezierCurveTo(
        point[0] + (this.width / 2) + this.center[0], point[1] + this.center[1] + (this.width / 2),
        point2[0] - (this.width / 2) + this.center[0], point2[1] + this.center[1] + (this.width / 2),
        point3[0] - (this.width / 2) + this.center[0], point3[1] + this.center[1]
      );

      this.ctx.moveTo(point[0] + this.center[0] + (this.width / 2), point[1] + this.center[1] );

      this.ctx.bezierCurveTo(
        point[0] + this.center[0] + (this.width / 2), point[1] + this.center[1] - (this.width / 2) ,
        point2[0] - (this.width / 2) + this.center[0], point2[1] + this.center[1] - (this.width / 2) ,
        point3[0] - (this.width / 2) + this.center[0], point3[1] + this.center[1]
      );

      this.ctx.stroke();
    }
  }

  update() {
    let rotation = this._timeRotation();
    let mouseRotation = this._mouseRotation();
    // let rotation = [Math.PI, 0];

    let x = Math.PI * .5 + (Math.PI * (rotation[0] + mouseRotation[0]));
    let y = (Math.PI * (rotation[1] + mouseRotation[1]));

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