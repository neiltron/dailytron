import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let shapes = [];
let connectors = [];
let total = 30;

for (let row = 0; row < 10; row++) {
  for (let i = 0; i < total; i++) {
    shapes.push(new Shape({
      position: [
        ((dimensions.width / total) * i + (dimensions.width / total) * .5) + (row % 2) * 20,
        dimensions.height / 2 + (row * 40)
      ],
      r: 15 - Math.floor(Math.random() * 10) + 20,
      g: 66 - Math.floor(Math.random() * 10) + 20,
      b: 1 - Math.floor(Math.random() * 10) + 20
    }));

    if (i > 0) {
      connectors.push(
        new Constraint({
          points: [
            shapes[i].points[0],
            shapes[i - 1].points[0]
          ],
          // restingDistance: 100,
          stiffness: .1
        })
      );
    }
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