import Rectangle from './src/rectangle';
import rotateZMatrix from './src/rotate_zmatrix.js';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';

let boxesTotal = dimensions.width / 16;
let boxes = [];

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;
let offset = _dimension / 12;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: _dimension / 4,
    height: _dimension / 4,
    index: i,
    center: [
      (dimensions.width / boxesTotal) * i,
      0
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
