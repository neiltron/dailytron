import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let regl = new Regl(canvas);
let boxWidth = dimensions.width / 10;
let boxHeight = dimensions.height / 5;
let boxesTotal = 500;
let boxes = [];
let buffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

document.body.appendChild(canvas);

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
  framebuffer: regl.prop('dest'),

  attributes: {
    position: regl.prop('position')
  },
  primitive: 'line loop',
  offset: regl.prop('offset'),

  uniforms: {
    time: regl.context('time'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution')
  }
})

const updatePixels = regl({
  frag: glslify('./src/shader2.frag'),
  vert: glslify('./src/shader2.vert'),
  count: 3,
  elements: null,
  depth: { enable: false },

  attributes: {
    position: [
      0, -4,
      4, 4,
      -4, 4
    ]
  },

  uniforms: {
    state: regl.prop('src'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})

let positions;

regl.frame(() => {
  positions = [];

  buffer.resize(1, 1);
  buffer.resize(dimensions.width, dimensions.height);

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();

    positions.push({
      dest: buffer,
      offset: i / boxesTotal,
      mousepos: [mouse().x, mouse().y],
      resolution: [canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio],
      position: [
        boxes[i].drawPoints[0],
        boxes[i].drawPoints[1],
        boxes[i].drawPoints[2],
        boxes[i].drawPoints[3]
      ]
    });
  }

  drawCanvas(positions);

  updatePixels({
    src: buffer,
    mousepos: [mouse().x, mouse().y],
    resolution: [canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio],
  })
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
