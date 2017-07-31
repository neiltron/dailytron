import Rectangle from './src/rectangle';
import rotateZMatrix from './src/rotate_zmatrix.js';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';

let boxesTotal = 1;
let boxes = [];

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;
let offset = _dimension / 12;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: _dimension / 3,
    height: _dimension / 3,
    index: i,
    center: [
      dimensions.width / i,
      dimensions.height / i
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
