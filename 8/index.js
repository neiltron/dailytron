import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';

import rotateZMatrix from './src/rotate_zmatrix.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let boxesTotal = 10;
let boxes = [];

document.body.appendChild(canvas);


canvas.width = dimensions.width;
canvas.height = dimensions.height;

canvas.style.width = dimensions.width;
canvas.style.height = dimensions.height;

// if (devicePixelRatio >= 2 && ('ontouchstart' in window)) {
//   canvas.width = dimensions.width * devicePixelRatio;
//   canvas.height = dimensions.height * devicePixelRatio;

//   ctx.scale(devicePixelRatio, devicePixelRatio);
// }

let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: _dimension / 1.6,
    height: _dimension / 1.6,
    delay: i,
    center: [
      (dimensions.width / 2),
      dimensions.height / 2
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.strokeStyle = '#ddd';

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
