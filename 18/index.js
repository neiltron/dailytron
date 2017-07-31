import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let shapes = [];
let connectors = [];

for (let i = 0; i < 1; i++) {
  shapes.push(new Shape({
    sides: Math.floor(Math.random() * 20 + 10),
    radius: dimensions.height / 3
  }));

  if (i > 0) {
    // connectors.push(
    //   new Constraint({
    //     points: [
    //       shapes[i].points[shapes[i].points.length - 1],
    //       shapes[i - 1].points[0]
    //     ],
    //     restingDistance: 100,
    //     stiffness: .2
    //   })
    // );

    // connectors.push(
    //   new Constraint({
    //     points: [
    //       shapes[i].points[0],
    //       shapes[i - 1].points[shapes[i - 1].points.length - 1]
    //     ],
    //     restingDistance: 100,
    //     stiffness: .2
    //   })
    // );
  }
}


function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].draw();
  }

  for (let i = 0; i < connectors.length; i++) {
    connectors[i].update();
    connectors[i].draw();
  }

  requestAnimationFrame(render);
}

render();