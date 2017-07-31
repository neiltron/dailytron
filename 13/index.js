import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import rotateZMatrix from './src/rotate_zmatrix.js';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let boxesTotal = 1;
let boxes = [];
let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: _dimension / 3,
    height: _dimension / 3,
    delay: i,
    center: [
      (dimensions.width / 2),
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
