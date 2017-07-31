import { canvas, ctx } from './canvas';
import { vec2 } from 'gl-matrix';

export default class Grass {
  constructor(opts) {
    this.index = opts.index;
    this.width = opts.width;
    this.height = opts.height;
    this.x = opts.x;
    this.y = opts.y;
    this.color = `rgba(${opts.r}, ${opts.g}, ${opts.b}, 1)`;
    this.stroke = `rgba(${opts.r + 50}, ${opts.g + 50}, ${opts.b + 50}, 1)`;

    this.timingX = Math.random() * 1000 + 500;
    this.timingY = Math.random() * 1000 + 500;
    this.sway = 5;
    this.mass = 1;

    this.points = [
      [0 + this.x,     0 + this.y],
      [0 + this.x,     -this.height + this.y],
      [this.width + this.x, -this.height * (Math.random() * .3 + .9) + this.y],
      [this.width + this.x, 0 + this.y]
    ];

    this.position = vec2.fromValues(this.x + 100 * (Math.random() - .5), this.y - (this.height * 2));
  }

  update() {
    vec2.lerp(this.position, this.position, vec2.fromValues(this.x, this.y), .01);
  }

  draw() {
    ctx.beginPath();

    ctx.moveTo(this.points[0][0], this.points[0][1]);
    ctx.quadraticCurveTo(this.points[1][0], this.points[1][1], this.points[1][0] - (this.x - this.position[0]), this.points[1][1]);
    ctx.lineTo(this.points[2][0] - (this.x - this.position[0]), this.points[2][1]);
    ctx.quadraticCurveTo(this.points[2][0], this.points[2][1], this.points[3][0], this.points[3][1]);

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    // ctx.strokeStyle = '#fff';
    ctx.fill();
    ctx.stroke();
  }
}