import { vec2 } from 'gl-matrix';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import flow from './src/flow';


let boxWidth = dimensions.width / 10;
let boxHeight = dimensions.height / 5;
let boxesTotal = 100;
let boxes = [];

document.body.appendChild(canvas);

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    width: 20,
    height: 20,
    delay: 1,
    position: [
      dimensions.width * Math.random(),
      dimensions.height * Math.random()
    ],
    center: [
      0, 0
      // (dimensions.width / boxesTotal) * (i + .5),
      // dimensions.width / 2,
      // dimensions.height / 2
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.strokeStyle = '#fff';

  // for (let i = 0; i < dimensions.width / flow.resolution; i++) {
  //   for (let j = 0; j < dimensions.height / flow.resolution; j++) {
  //     let velocity = flow.grid[i][j];
  //     velocity = vec2.fromValues((Math.sin(velocity * 3) - .5) * Math.PI, (Math.cos(velocity * 3) - .5) * Math.PI);
  //     let x = i * flow.resolution;
  //     let y = j * flow.resolution;

  //     ctx.beginPath();
  //     ctx.moveTo(x, y);
  //     ctx.lineTo(x + velocity[0] * flow.resolution / 2, y + velocity[1] * flow.resolution / 2);
  //     ctx.strokeStyle = '#666';
  //     ctx.stroke();
  //   }
  // }

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
