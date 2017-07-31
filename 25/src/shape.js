import dimensions from './dimensions';
import Rectangle from './rectangle';
import Constraint from './constraint';
import { canvas, ctx } from './canvas';
import mouse from './mousemove';
import { vec2 } from 'gl-matrix';

export default class Shape {
  constructor(opts) {
    opts = opts || {};

    this.position = opts.position || [dimensions.width / 2, dimensions.height / 2];
    this.constraints = [];
    this.innerConstraints = [];
    this.points = [];
    this.boxSize = 10;
    this.selectedBox = null;
    this.row = opts.row;
    this.column = opts.column;

    this.color = `rgba(${opts.r}, ${opts.g}, ${opts.b}, 1)`;
    this.stroke = `rgba(${opts.r + 50}, ${opts.g + 50}, ${opts.b + 50}, 1)`;

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
      for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].mass == 0) { return; }

        let distance = vec2.distance(this.points[i].position, position);

        if (distance < 50) {
          let distanceX = this.points[i].position[0] - position[0];
          this.points[i].position[0] += distanceX / 10;
        }
      }
    }.bind(this));

    mouse.upCallbacks.push(function (e, position) {
      this.selectedBox = null;
    }.bind(this));
  }

  draw(noise) {
    for (var i = 0; i < this.points.length; i++) {
      if (this.points[i].mass == 0) { continue; }

      this.points[0].position[0] += (noise.get(this.row, this.column) - .5) / 2;
    }

    for (var i = 0; i < this.constraints.length; i++) {
      this.constraints[i].update();
    }

    for (var i = 0; i < this.innerConstraints.length; i++) {
      this.innerConstraints[i].update();
    }

    for (var i = 0; i < this.points.length; i++) {
      this.points[i].update();
      // this.points[i].draw();
    }

    // ctx.beginPath();

    // for (var i = 0; i < this.constraints.length; i++) {
    //   this.constraints[i].draw();
    // }

    // for (var i = 0; i < this.innerConstraints.length; i++) {
    //   this.innerConstraints[i].draw();
    // }

    // ctx.closePath();
    // ctx.stroke();
    // ctx.fill();

    ctx.beginPath();
    // ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    // ctx.strokeStyle = '#000';

    ctx.moveTo(this.points[0].position[0], this.points[0].position[1]);

    for (var i = 2; i < this.points.length; i += 2) {
      ctx.lineTo(this.points[i].position[0], this.points[i].position[1]);
    }

    for (var i = this.points.length - 1; i > 0; i -= 2) {
      ctx.lineTo(this.points[i].position[0], this.points[i].position[1]);
    }

    ctx.closePath();
    ctx.stroke();
    // ctx.fill();
  }

  setup() {
    let rows = 4;

    for (var i = 0; i <= rows * 2; i += 2) {
      let mass = i > (rows - 1) * 2 ? 0 : 1;
      let distance = 90;

      this.points.push(new Rectangle({
        ctx: ctx,
        width: this.boxSize,
        height: this.boxSize,
        mass: mass,
        position: [
          Math.floor(-(i * this.boxSize / 10)) + this.position[0],
         distance * Math.floor((i + 1) / 2) + this.position[1]
        ],
      }));

      this.points.push(new Rectangle({
        ctx: ctx,
        width: this.boxSize,
        height: this.boxSize,
        mass: mass,
        position: [
          Math.floor((i * this.boxSize / 4)) + this.position[0],
          distance * Math.floor((i + 1) / 2) + this.position[1]
        ],
      }));

      if (i > 1) {
        this.constraints.push(
          new Constraint({
            points: [
              this.points[i],
              this.points[i - 2]
            ],
            stiffness: .1,
          })
        );

        this.constraints.push(
          new Constraint({
            points: [
              this.points[this.points.length - 1],
              this.points[this.points.length - 3]
            ],
            stiffness: .1,
          })
        );
      }
    }

    this.constraints.push(
      new Constraint({
        points: [
          this.points[1],
          this.points[0]
        ],
        stiffness: .2,
      })
    );

    for (var i = 1; i < (rows * 2) + 2; i += 2) {
      this.innerConstraints.push(
        new Constraint({
          points: [
            this.points[i],
            this.points[i - 1]
          ],
          stiffness: .2 + (i * .02),
        })
      );
    }

    for (var i = 2; i < (rows * 2) + 2; i += 2) {
      this.innerConstraints.push(
        new Constraint({
          points: [
            this.points[i],
            this.points[i - 1]
          ],
          stiffness: .2 + (i * .02),
        })
      );
    }
  }
}