import Rectangle from './src/rectangle';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import mouse from './src/mousemove';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let boxes = [];
let constraints = [];
let selectedBox = null;
let boxSize = 30;
let isMobile = 'ontouchstart' in window;
let rows = Math.floor(dimensions.height / (boxSize * 3.5));
let columns = Math.floor(dimensions.width / (boxSize * 5));

for (let i = 0; i < rows * columns; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: rows * columns,
    width: boxSize,
    height: boxSize,
    index: i,
    mass: i < columns ? 0 : 1,
    position: [
      Math.floor(i % columns) * ((dimensions.width / columns)) + ((dimensions.width / columns)) / 2,
      Math.floor(i / columns) * (boxSize * 2) + (boxSize * 2)
    ],
  }));


}

for (let i = 0; i < rows * columns; i++) {
  let row = Math.floor(i / columns);
  let column = i % columns;

  if (column >= 1) {
    constraints.push(
      new Constraint({
        points: [
          boxes[i],
          boxes[i - 1]
        ]
      })
    );
  }

  if (column < columns - 1 && row < rows - 1) {
    constraints.push(
      new Constraint({
        points: [
          boxes[i],
          boxes[i + columns + 1]
        ]
      })
    );
  }

  if (row < rows - 1) {
    constraints.push(
      new Constraint({
        points: [
          boxes[i],
          boxes[i + columns]
        ]
      })
    );
  }
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < rows * columns; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  for (let i = 0; i < constraints.length; i++) {
    constraints[i].update();
    constraints[i].draw();
  }

  requestAnimationFrame(render);
}

render();


mouse.downCallbacks.push(function (e) {
  for (let i = 0; i < boxes.length; i++) {
    if (
      this.position[0] > boxes[i].position[0] - boxes[i].width / 2
      && this.position[0] < boxes[i].position[0] + boxes[i].width / 2
      && this.position[1] > boxes[i].position[1] - boxes[i].height / 2
      && this.position[1] < boxes[i].position[1] + boxes[i].height / 2
    ) {
      selectedBox = i;

      continue;
    }
  }
})

mouse.moveCallbacks.push(function (e) {
  if (selectedBox !== null) {
    boxes[selectedBox].position = this.position;
  }
});

mouse.upCallbacks.push(function (e) {
  selectedBox = null;
});