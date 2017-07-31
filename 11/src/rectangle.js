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

      this.ctx.beginPath();

      this.ctx.arc(dimensions.width / 2, dimensions.height / 2, this.width, 0, 2 * Math.PI)

      let center = [dimensions.width / 2, dimensions.height / 2];

      let total = 10;

      for (let i = 0; i < total; i++) {
        let angle = (360 / total) * i * (Math.PI / 180) + point[0] / 100;

        let startX = center[0];
        let startY = center[1];

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let x = cos + startX;
        let y = sin + startY;
        let endX = cos * this.width + x;
        let endY = sin * this.width + y;
        let midX = cos * (this.width) + x - (dimensions.width / 2) + mouse().x;
        let midY = sin * (this.height) + y - (dimensions.height / 2) +  mouse().y;

        //   var startXPos = cosAngle * offset + startX;
        // var startYPos = sinAngle * offset + startY;
        // var endXPos = cosAngle * length + startXPos;
        // var endYPos = sinAngle * length + startYPos;

        this.ctx.moveTo(x, y);
        this.ctx.bezierCurveTo(
          midX, midY,
          midX, midY,
          endX, endY
        );
      }

      this.ctx.stroke();
    }
  }

  update() {
    let rotation = this._timeRotation();
    // let mouseRotation = this._mouseRotation();
    // let rotation = [Math.PI, 0];

    let x = Math.PI * .5 + (Math.PI * (rotation[0]));
    let y = (Math.PI * (rotation[1]));

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