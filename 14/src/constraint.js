import { vec2 } from 'gl-matrix';
import { canvas, ctx } from './canvas';

export default class Constraint {
  constructor (opts) {
    this.drawConstraint = opts.drawConstraint || true;
    this.points = opts.points;
    this.restingDistance = opts.restingDistance || 200;
  }

  draw() {
    if (this.drawConstraint) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].position[0], this.points[0].position[1]);
      ctx.lineTo(this.points[1].position[0], this.points[1].position[1]);
      ctx.stroke();
    }
  }

  update() {
    let distance = vec2.distance(this.points[0].position, this.points[1].position);
    let diffX = this.points[0].position[0] - this.points[1].position[0];
    let diffY = this.points[0].position[1] - this.points[1].position[1];

    let difference = (this.restingDistance - distance) / distance;

    let translateX = diffX * .5 * difference;
    let translateY = diffY * .5 * difference;

    this.points[0].position[0] += translateX / 5;
    this.points[0].position[1] += translateY / 5;

    this.points[1].position[0] -= translateX / 5;
    this.points[1].position[1] -= translateY / 5;
  }
}