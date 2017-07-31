import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import noise from './src/noise';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let shapes = [];
let connectors = [];
let columns = Math.floor(dimensions.width / 32);
let rows = Math.floor(dimensions.height / 68);

if (dimensions.width < 720) {
  rows *= 2;
  columns *= 1.5;
}

for (let row = 0; row < rows; row++) {
  for (let i = 0; i < columns; i++) {
    shapes.push(new Shape({
      row: row,
      column: i,
      position: [
        ((dimensions.width / (columns + 1)) * i + (dimensions.width / columns) * .5) + (row % 2) * 50,
        (dimensions.height / rows) * row
      ],
      r: 68 - Math.floor(Math.random() * 10),
      g: 43 - Math.floor(Math.random() * 10),
      b: 20 - Math.floor(Math.random() * 10)
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

  // noise.seed(Date.now() / 10000000000000);

  let perlin = noise({
    seed: Date.now() / 10000000000000,
    dimensions: 2,
    wavelength: 12,
    octaves: 2
  });

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].draw(perlin);
  }

  for (let i = 0; i < connectors.length; i++) {
    connectors[i].update();
    connectors[i].draw();
  }

  requestAnimationFrame(render);
}

render();