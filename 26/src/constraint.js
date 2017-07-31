import { vec2 } from 'gl-matrix';
import { canvas, ctx } from './canvas';

export default class Constraint {
  constructor (opts) {
    this.drawConstraint = opts.drawConstraint || true;
    this.points = opts.points;
    this.restingDistance = opts.restingDistance || vec2.distance(this.points[0].position, this.points[1].position) - 5;
    this.stiffness = opts.stiffness || .1;
  }

  draw() {
    if (this.drawConstraint) {
      // ctx.beginPath();
      ctx.moveTo(this.points[0].position[0], this.points[0].position[1]);
      ctx.lineTo(this.points[1].position[0], this.points[1].position[1]);
      // ctx.stroke();
    }
  }

  update() {
    let distance = vec2.distance(this.points[0].position, this.points[1].position);
    let diffX = this.points[0].position[0] - this.points[1].position[0];
    let diffY = this.points[0].position[1] - this.points[1].position[1];

    let difference = (this.restingDistance - distance) / distance;

    let translateX = diffX * this.stiffness * difference;
    let translateY = diffY * this.stiffness * difference;

    if (this.points[0].mass !== 0) {
      this.points[0].position[0] += translateX * (2 / this.points[0].mass);
      this.points[0].position[1] += translateY * (2 / this.points[0].mass);
    }

    if (this.points[1].mass !== 0) {
      this.points[1].position[0] -= translateX * (2 / this.points[1].mass);
      this.points[1].position[1] -= translateY * (2 / this.points[1].mass);
    }
  }
}