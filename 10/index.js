import Rectangle from './src/rectangle';
import rotateZMatrix from './src/rotate_zmatrix.js';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';

let boxesTotal = 25;
let boxes = [];

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;
let offset = _dimension / 12;

for (let i = 0; i < boxesTotal; i++) {
  if (i < 2) { continue; }

  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: _dimension / 10 + (i * offset),
    height: _dimension / 10 + (i * offset),
    index: i,
    center: [
      dimensions.width / 2,
      dimensions.height / 2
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
