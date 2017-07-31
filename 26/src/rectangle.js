import { vec2 } from 'gl-matrix';
import dimensions from './dimensions';
import mouse from './mousemove';
import { canvas, ctx } from './canvas';
import flow from './flow';

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.position = this.lastPosition = vec2.fromValues(opts.position[0], opts.position[1]);
    this.ctx = opts.ctx;
    this.index = opts.index;
    this.zMatrix = [];

    if (typeof opts.mass !== 'undefined') {
      this.mass = opts.mass;
    } else {
      this.mass = (Math.random() * 2 + 1) * (this.index % 2 == 0 ? 1 : -1)
    }

    this.update();
  }

  draw() {
    ctx.lineWidth = ('ontouchstart' in window) ? 1 : 2;
    ctx.beginPath();

    ctx.moveTo(this.position[0] - this.width / 2, this.position[1] - this.height / 2);
    ctx.lineTo(this.position[0] - this.width / 2, this.position[1] + this.height / 2);
    ctx.lineTo(this.position[0] + this.width / 2, this.position[1] + this.height / 2);
    ctx.lineTo(this.position[0] + this.width / 2, this.position[1] - this.height / 2);
    ctx.closePath();

    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  update() {
    let flowVelocity = flow.lookup(this.position);
    let velocityX = flowVelocity[0];
    let velocityY = flowVelocity[1];

    if (this.position[0] >= dimensions.width) {
      velocityX *= -10;
      this.position[0] = 20;
    } else if (this.position[0] <= 0) {
      velocityX *= -10;
      this.position[0] = dimensions.width - 1;
    }

    if (this.position[1] >= dimensions.height) {
      velocityY *= -10;
      this.position[1] = 20;
    } else if (this.position[1] <= 0) {
      velocityY *= -10;
      this.position[1] = dimensions.height - 1;
    }

    let nextX = this.position[0] + velocityX * (this.mass == 0 ? 0 : (1 / this.mass));
    let nextY = this.position[1] + velocityY * (this.mass == 0 ? 0 : (1 / this.mass));

    this.lastPosition = this.position;

    this.position = [nextX, nextY];
  }
}