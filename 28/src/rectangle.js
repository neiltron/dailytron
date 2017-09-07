import dimensions from './dimensions';
import mouse from './mousemove';
import flow from './flow';
import { vec2, vec3 } from 'gl-matrix';

let points = [
  [0, -1],
  [-1, 1],
  [-.05, 1],

  [0, -1],
  [1, 1],
  [.05, 1],
  [0, -1]
];

export default class Rectangle {
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.center = vec3.fromValues(opts.center[0], opts.center[1], 0);
    this.position = vec3.fromValues(opts.position[0], opts.position[1], 0);
    this.ctx = opts.ctx;
    this.delay = opts.delay;
    this.zMatrix = [];
    this.boxSize = 20;
    this.mass = 1;

    this.rotation = {
      x: 0, y: 0, z: 0
    };

    this.update();
    this.points = [];
    this.drawPoints = [];

    for (let i = 0; i < points.length; i++) {
      this.points.push(vec3.fromValues(points[i][0], points[i][1], 0));
      this.drawPoints.push(vec3.fromValues(points[i][0], points[i][1], 0));
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

    this.ctx.stroke();
  }

  update() {
    let flowVelocity = flow.lookup({ x: this.position[0], y: this.position[1] });
    flowVelocity = vec2.fromValues((Math.sin(flowVelocity * 3) - .5) * Math.PI, (Math.cos(flowVelocity * 3) - .5) * Math.PI);

    if (this.position[0] >= dimensions.width) {
      this.position[0] = this.boxSize;
      this.position[1] = dimensions.height * Math.random();
    } else if (this.position[0] <= 0) {
      this.position[0] = dimensions.width;
      this.position[1] = dimensions.height * Math.random();
    }

    if (this.position[1] >= dimensions.height) {
      this.position[0] = dimensions.width * Math.random();
      this.position[1] = this.boxSize * 1.5;
    } else if (this.position[1] <= this.boxSize) {
      this.position[0] = dimensions.width * Math.random();
      this.position[1] = dimensions.height - this.boxSize;
    }

    let nextX = this.position[0] + flowVelocity[0];
    let nextY = this.position[1] + flowVelocity[1];

    this.position = vec3.fromValues(nextX, nextY, 0);

    let rotation = vec2.fromValues(this.rotation.x, this.rotation.y, this.rotation.z);

    let x = Math.sin(vec3.angle(this.position, vec3.fromValues(flowVelocity[0], flowVelocity[1], 1) )) * (Math.PI / 2);
    let y = Math.cos(vec3.angle(this.position, vec3.fromValues(flowVelocity[0], flowVelocity[1], 1) )) * (Math.PI / 2);

    vec2.lerp(rotation, rotation, [x, y], .1);

    this.rotation.x = rotation[0] - .9;
    this.rotation.y = rotation[1];

    let matrix = [
      Math.cos(this.rotation.x), -Math.sin(this.rotation.x),    0, 0,
      -Math.sin(this.rotation.y),  Math.cos(this.rotation.y),   0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    if (this.points) {
      for (let i = 0; i < this.points.length; i++) {
        vec3.transformMat4(this.drawPoints[i], this.points[i], matrix);
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
    let time = Date.now() * (.2 * (this.delay + 1));

    return [
      ((Math.sin(time / 1000) + 1)),
      ((Math.cos(time / 1000) + 1))
    ];
  }
}