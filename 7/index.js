import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';

import rotateZMatrix from './src/rotate_zmatrix.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let boxesTotal = 4;
let boxes = [];

document.body.appendChild(canvas);

canvas.width = dimensions.width;
canvas.height = dimensions.height;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: dimensions.width / 100,
    height: dimensions.height / 100,
    delay: i,
    center: [
      (dimensions.width / 2),
      dimensions.height / 2
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.strokeStyle = '#fff';

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
