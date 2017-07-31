import Rectangle from './src/rectangle';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { canvas, ctx } from './src/canvas';
import mouse from './src/mousemove';

let boxesTotal = 2;
let boxes = [];
let constraints = [];
let selectedBox = null;

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let _dimension = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;
let offset = _dimension / 12;
let boxSize = 30;

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    total: boxesTotal,
    width: boxSize,
    height: boxSize,
    index: i,
    position: [
      (dimensions.width / boxesTotal) * (i + .5),
      dimensions.height / 2
    ],
  }));
}

constraints.push(
  new Constraint({
    points: [
      boxes[0],
      boxes[1]
    ]
  })
)

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  for (let i = 0; i < boxes.length; i++) {
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