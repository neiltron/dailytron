import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let boxWidth = dimensions.width / 10;
let boxHeight = dimensions.height / 5;
let boxesTotal = 500;
let boxes = [];

document.body.appendChild(canvas);
let regl = new Regl(canvas);

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    width: 20,
    height: 20,
    delay: 1,
    index: i,
    total: boxesTotal,
    position: [
      -1,
      0
    ],
    center: [
      ((1 / boxesTotal) - .5) * (i) + 1, ((1 / boxesTotal) - .5) * (i) + 1
      // (dimensions.width / boxesTotal) * (i + .5),
      // dimensions.width / 2,
      // dimensions.height / 2
    ],
  }));
}

const drawCanvas = regl({
  frag: glslify('./src/shader.frag'),
  vert: glslify('./src/shader.vert'),
  count: 4,

  attributes: {
    position: regl.prop('position')
  },
  primitive: 'line loop',
  offset: regl.prop('offset'),

  uniforms: {
    time: regl.context('time'),
    u_mousepos: [mouse().x, mouse().y]
  }
})

console.log('na')

let positions;

regl.frame(() => {
  positions = [];

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();

    positions.push({
      offset: i / boxesTotal,
      position: [
        // [-.5, -.5],
        // [-.5,  .5],
        // [ .5,  .5],
        // [ .5, -.5],
        boxes[i].drawPoints[0],
        boxes[i].drawPoints[1],
        boxes[i].drawPoints[2],
        boxes[i].drawPoints[3]
      ]
    });
  }

  drawCanvas(positions);
})


// function render () {
//   // ctx.clearRect(0, 0, dimensions.width, dimensions.height);
//   ctx.strokeStyle = '#fff';

//   // for (let i = 0; i < boxes.length; i++) {
//   //   boxes[i].update()
//   //   boxes[i].draw();
//   // }

//   requestAnimationFrame(render);
// }

// render();
