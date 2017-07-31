import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';

import rotateZMatrix from './src/rotate_zmatrix.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let boxesTotal = 200;
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
    width: _dimension / 10,
    height: _dimension / 10,
    rotationOffset: [
      Math.PI,
      Math.PI * Math.random() - .5,
    ],
    delay: boxesTotal * Math.random(),
    center: [
      (dimensions.width * Math.random()),
      -dimensions.height * 20 * Math.random()
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.strokeStyle = '#A6AD23';

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
