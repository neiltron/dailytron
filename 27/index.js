import { vec2 } from 'gl-matrix';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import mouse from './src/mousemove';
import Rectangle from './src/rectangle';
import { canvas, ctx } from './src/canvas';
import flow from './src/flow';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';


let pointCount = 300;
let points = [];

for (let i = 0; i < pointCount; i++) {
  points.push(
    new Rectangle({
      index: i,
      width: 10,
      height: 10,
      position: [
        dimensions.width * Math.random(),
        dimensions.height * Math.random(),
      ]
    })
  );
}


function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < dimensions.width / flow.resolution; i++) {
    for (let j = 0; j < dimensions.height / flow.resolution; j++) {
      let velocity = flow.grid[i][j];
      velocity = vec2.fromValues((Math.sin(velocity * 3) - .5) * Math.PI, (Math.cos(velocity * 3) - .5) * Math.PI);
      let x = i * flow.resolution;
      let y = j * flow.resolution;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + velocity[0] * 5, y + velocity[1] * 5);
      ctx.strokeStyle = '#666';
      ctx.stroke();
    }
  }

  ctx.strokeStyle = '#fff';

  for (let i = 0; i < pointCount; i++) {
    points[i].update();
    points[i].draw();
  }

  requestAnimationFrame(render);
}

render();