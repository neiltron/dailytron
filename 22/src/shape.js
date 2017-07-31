import dimensions from './dimensions';
import Rectangle from './rectangle';
import Constraint from './constraint';
import { canvas, ctx } from './canvas';
import mouse from './mousemove';

export default class Shape {
  constructor(opts) {
    opts = opts || {};

    this.position = opts.position || [dimensions.width / 2, dimensions.height / 2];
    this.sides = opts.sides || 6;
    this.radius = opts.radius || 100;
    this.constraints = [];
    this.innerConstraints = [];
    this.points = [];
    this.boxSize = 30;
    this.selectedBox = null

    this.setup();

    mouse.downCallbacks.push(function (e, position) {
      for (let i = 0; i < this.points.length; i++) {
        if (
          position[0] > this.points[i].position[0] - this.points[i].width / 2
          && position[0] < this.points[i].position[0] + this.points[i].width / 2
          && position[1] > this.points[i].position[1] - this.points[i].height / 2
          && position[1] < this.points[i].position[1] + this.points[i].height / 2
        ) {
          this.selectedBox = i;

          continue;
        }
      }
    }.bind(this))

    mouse.moveCallbacks.push(function (e, position) {
      if (this.selectedBox !== null) {
        this.points[this.selectedBox].position = position;
      }
    }.bind(this));

    mouse.upCallbacks.push(function (e, position) {
      this.selectedBox = null;
    }.bind(this));
  }

  draw() {
    for (var i = 0; i < this.constraints.length; i++) {
      this.constraints[i].update();
    }

    for (var i = 0; i < this.innerConstraints.length; i++) {
      this.innerConstraints[i].update();
    }

    for (var i = 0; i < this.points.length; i++) {
      this.points[i].update();
      this.points[i].draw();
    }

    ctx.beginPath();

    for (var i = 0; i < this.constraints.length; i++) {
      this.constraints[i].draw();
    }

    for (var i = 0; i < this.innerConstraints.length; i++) {
      this.innerConstraints[i].draw();
    }

    ctx.closePath();
    ctx.stroke();
    // ctx.fill();
  }

  setup() {
    let angle = 2 * Math.PI / this.sides;

    for (var i = 0; i < this.sides; i++) {
      let _angle = i * angle;

      this.points.push(new Rectangle({
        ctx: ctx,
        total: this.sides,
        width: this.boxSize,
        height: this.boxSize,
        index: i,
        mass: 1,
        position: [
          Math.floor(this.radius * Math.sin(_angle)) + dimensions.width / 2,
          Math.floor(this.radius * Math.cos(_angle)) + dimensions.height / 2
        ],
      }));

      if (i > 0) {
        this.constraints.push(
          new Constraint({
            points: [
              this.points[i - 1],
              this.points[i]
            ],
            stiffness: .1
          })
        );
      }

      if (i == this.sides - 1) {
        this.constraints.push(
          new Constraint({
            points: [
              this.points[i],
              this.points[0]
            ],
            stiffness: .1
          })
        );
      }
    }

    for (var i = 0; i < this.sides; i += 1) {
      for (var j = 0; j < this.sides; j += 1) {
        if (i !== j) {
          this.innerConstraints.push(
            new Constraint({
              points: [
                this.points[i],
                this.points[j]
              ],
              stiffness: .01
            })
          );
        }
      }
    }
  }
}