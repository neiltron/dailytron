import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import Grass from './src/grass';

document.body.appendChild(canvas);
ctx.strokeStyle = '#155C01';

let blades = [];
let total = 2500;

for (var i = 0; i < total; i++) {
  blades.push(
    new Grass({
      width: 15 + Math.random() * 5,
      height: 100 + Math.random() * 10,
      x: dimensions.width * Math.random(),
      y: dimensions.height * (i / total) + (dimensions.height / 2),
      r: 15 - Math.floor(Math.random() * 10),
      g: 66 - Math.floor(Math.random() * 10),
      b: 1 - Math.floor(Math.random() * 10)
    })
  );
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < blades.length; i++) {
    blades[i].draw();
  }

  requestAnimationFrame(render);
}

render();