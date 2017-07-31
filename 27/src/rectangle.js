import { vec2 } from 'gl-matrix';
import dimensions from './dimensions';
import mouse from './mousemove';
import { canvas, ctx } from './canvas';
import flow from './flow';
import world from './world';
import Matter from 'matter-js';

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.ctx = opts.ctx;
    this.index = opts.index;
    this.body = Matter.Bodies.rectangle(opts.position[0], opts.position[1], this.width, this.height);

    this.body.inertia = 1;
    this.body.frictionAir = .1;

    if (typeof opts.mass !== 'undefined') {
      this.body.mass = opts.mass;
    } else {
      this.body.mass = (Math.random() * 10 + 5) * (this.index % 2 == 0 ? 1 : -1)
    }

    Matter.World.add(world.world, [
      this.body
    ]);

    let flowVelocity = flow.lookup(this.body.position);
    flowVelocity = vec2.fromValues((Math.sin(flowVelocity * 3) - .5) * Math.PI / 1000, (Math.cos(flowVelocity * 3) - .5) * Math.PI / 1000);

    Matter.Body.applyForce(this.body, this.body.position, { x: flowVelocity[0], y: flowVelocity[1] })

    this.update();
  }

  draw() {
    ctx.lineWidth = ('ontouchstart' in window) ? 1 : 2;
    ctx.beginPath();

    ctx.moveTo(this.body.position.x - this.width / 2, this.body.position.y - this.height / 2);
    ctx.lineTo(this.body.position.x - this.width / 2, this.body.position.y + this.height / 2);
    ctx.lineTo(this.body.position.x + this.width / 2, this.body.position.y + this.height / 2);
    ctx.lineTo(this.body.position.x + this.width / 2, this.body.position.y - this.height / 2);
    ctx.closePath();

    ctx.stroke();
  }

  update() {
    if (this.body.position.x >= dimensions.width) {
      Matter.Body.setPosition(this.body, { x: 10, y: this.body.position.y });
    } else if (this.body.position.x <= 0) {
      Matter.Body.setPosition(this.body, { x: dimensions.width - 10, y: this.body.position.y });
    }

    if (this.body.position.y >= dimensions.height) {
      Matter.Body.setPosition(this.body, { x: this.body.position.x, y: 10 });
    } else if (this.body.position.y <= 0) {
      Matter.Body.setPosition(this.body, { x: this.body.position.x, y: dimensions.height - 10 });
    }

    let flowVelocity = flow.lookup(this.body.position);
    flowVelocity = vec2.fromValues((Math.sin(flowVelocity * 3) - .5) * Math.PI / 500, (Math.cos(flowVelocity * 3) - .5) * Math.PI / 500);

    Matter.Body.applyForce(this.body, this.body.position, { x: flowVelocity[0], y: flowVelocity[1] })
  }
}