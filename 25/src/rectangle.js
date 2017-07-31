import { vec2 } from 'gl-matrix';
import dimensions from './dimensions';
import mouse from './mousemove';

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.position = this.lastPosition = vec2.fromValues(opts.position[0], opts.position[1]);
    this.ctx = opts.ctx;
    this.index = opts.index;
    this.total = opts.total;
    this.zMatrix = [];
    this.isLast = opts.total - 1 == opts.index;

    if (typeof opts.mass !== 'undefined') {
      this.mass = opts.mass;
    } else {
      this.mass = 1;
    }

    this.update();
  }

  draw() {
    this.ctx.lineWidth = ('ontouchstart' in window) ? 1 : 2;
    this.ctx.beginPath();

    this.ctx.moveTo(this.position[0] - this.width / 2, this.position[1] - this.height / 2);
    this.ctx.lineTo(this.position[0] - this.width / 2, this.position[1] + this.height / 2);
    this.ctx.lineTo(this.position[0] + this.width / 2, this.position[1] + this.height / 2);
    this.ctx.lineTo(this.position[0] + this.width / 2, this.position[1] - this.height / 2);
    this.ctx.closePath();

    this.ctx.stroke();
  }

  update() {
    let velocityX = this.position[0] - this.lastPosition[0];
    let velocityY = this.position[1] - this.lastPosition[1] - 1;

    if (this.position[0] >= dimensions.width) {
      velocityX *= -1;
      this.position[0] = dimensions.width - 1;
    } else if (this.position[0] <= 0) {
      velocityX *= -1;
      this.position[0] = 1;
    }

    if (this.position[1] >= dimensions.height) {
      velocityY *= -1;
      this.position[1] = dimensions.height - 1;
    } else if (this.position[1] <= 0) {
      velocityY *= -1;
      this.position[1] = 1;
    }

    let nextX = this.position[0] + velocityX * (this.mass == 0 ? 0 : (1 / this.mass));
    let nextY = this.position[1] + velocityY * (this.mass == 0 ? 0 : (1 / this.mass));

    this.lastPosition = this.position;

    this.position = [nextX, nextY];
  }

  _mouseRotation() {
    return [
      (mouse.position[0] / dimensions.width),
      (mouse.position[1] / dimensions.height) - .5
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