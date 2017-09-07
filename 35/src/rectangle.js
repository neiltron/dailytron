import dimensions from './dimensions';
import mouse from './mousemove';
import { vec2, vec3, mat3 } from 'gl-matrix';

let points = [
  [-.1, -.1],
  [-.1,  .1],
  [ .1,  .1],
  [ .1, -.1]
];

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.center = vec3.fromValues(opts.center[0], opts.center[1], 0);
    this.position = vec3.fromValues(opts.position[0], opts.position[1], 0);
    this.ctx = opts.ctx;
    this.index = opts.index;
    this.total = opts.total;
    this.zMatrix = [];
    this.boxSize = 1;
    this.mass = 1;

    this.rotation = {
      x: 0, y: 0, z: 0
    };

    this.update();
    this.points = [];
    this.drawPoints = [];

    for (let i = 0; i < points.length; i++) {
      this.points.push(vec3.fromValues(points[i][0] + this.index / (this.total / 5), points[i][1] + this.index / (this.total / 5), 0));
      this.drawPoints.push(vec3.fromValues(points[i][0] + this.center[0], points[i][1] + this.center[1], 0));
    }
  }

  draw() {
    this.ctx.lineWidth = 1;

    let point = this.drawPoints[0];
    let centerX = (this.center[0] / 2) * Math.sin(Date.now() / 4000) + this.position[0];
    let centerY = (this.center[1] / 2) * Math.cos(Date.now() / 4000) + this.position[1];

    this.ctx.beginPath();
    this.ctx.moveTo(point[0] * this.boxSize + centerX, point[1] * this.boxSize + centerY);

    for (var i = 0; i < this.points.length; i++) {
      let point = this.drawPoints[i]

      this.ctx.lineTo(point[0] * this.boxSize + centerX, point[1] * this.boxSize + centerY);
    }

    this.ctx.closePath();
    this.ctx.stroke();
  }

  update() {
    let rotation = this._timeRotation();

    if (this.points) {
      for (let i = 0; i < this.points.length; i++) {

        // mat3.rotate(rotateMatrix, rotateMatrix, rotation[1]);
        // vec3.transformMat3(this.drawPoints[i], this.points[i], rotateMatrix);
        vec3.rotateZ(this.drawPoints[i], this.points[i], vec3.fromValues(0, 0, 0), rotation[0] / 8 + 1.5)
        // vec3.rotateY(this.drawPoints[i], this.drawPoints[i], vec3.fromValues(0, 0, 0), rotation[0])

        // vec3.transformMat4(this.drawPoints[i], this.points[i], matrix);

        // console.log(this.resultMatrix, this.drawPoints[i])
      }
    }
  }

  _mouseRotation() {
    return [
      Math.sin((dimensions.width - mouse().x) / (dimensions.width)) / 2,
      Math.cos((dimensions.height - mouse().y) / (dimensions.height)) / 2
    ]
  }

  _timeRotation() {
    let divisor = ('ontouchstart' in window) ? 10 : 5;
    let time = Date.now() * .2;

    return [
      ((Math.sin(time / 500) + 1)),
      ((Math.cos(time / 500) + 1))
    ];
  }
}