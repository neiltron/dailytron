import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import Grass from './src/grass';
import mouse from './src/mousemove';
import { vec2 } from 'gl-matrix';

document.body.appendChild(canvas);
ctx.strokeStyle = '#155C01';

let blades = [];
let constraints = [];

let grassWidth = 20;
let grassHeight = 200;

let columnCount = Math.floor(dimensions.width / (grassWidth / 2));
let rowCount = dimensions.height / (grassHeight / 2);
let rows = [];

let total = rowCount * columnCount;
let index = -1;

for (var i = 0; i < rowCount; i++) {
  var row = [];

  for (var j = 0; j < columnCount; j++) {
    index++;

    let width = (grassWidth * 1.1) + Math.random() * 5;
    let height = (grassHeight * 1.1) + Math.random() * 10

    let blade = new Grass({
      index: index,
      width: width,
      height: height,
      x: j * (width / 2),
      y: i * (height / 2) + (grassHeight * .8),
      r: 15 - Math.floor(Math.random() * 10) + 20,
      g: 66 - Math.floor(Math.random() * 10) + 20,
      b: 1 - Math.floor(Math.random() * 10) + 20
    });

    blades.push(blade);
    row.push(blade);

    if (j > 0) {
      constraints.push(
        new Constraint({
          points: [
            blades[index - 1],
            blades[index]
          ],
          stiffness: .3
        })
      );
    }

    if (i > 0) {
      constraints.push(
        new Constraint({
          points: [
            rows[i - 1][j],
            blades[index]
          ],
          stiffness: .3
        })
      );
    }
  }

  rows.push(row);
}

mouse.moveCallbacks.push((e, position) => {
  position[1] += 50;

  for (var i = 0; i < total; i++) {
    let distance = vec2.distance(blades[i].position, position);
    let distanceX = blades[i].position[0] - position[0];
    let distanceY = blades[i].position[1] - position[1];

    if (distance < 100) {
      blades[i].position[0] += distanceX / 4;
      blades[i].position[1] += distanceY / 4;
    } else {
      // blades[i].position[0] = blades[i].x;
      // blades[i].position[1] = blades[i].y;
    }
  }
})

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < blades.length; i++) {
    blades[i].update();
    blades[i].draw();
  }

  for (let i = 0; i < constraints.length; i++) {
    constraints[i].update();
    // constraints[i].draw();
  }

  requestAnimationFrame(render);
}

render();