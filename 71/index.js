import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let boxWidth = dimensions.width / 10;
let boxHeight = dimensions.height / 5;
let boxesTotal = 10;
let boxes = [];

document.body.appendChild(canvas);
let regl = new Regl(canvas);

const drawCanvas = regl({
  frag: glslify('./src/shader.frag'),
  vert: glslify('./src/shader.vert'),
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
    src: regl.prop('src'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})


regl.frame(() => {
  drawCanvas({
    mousepos: [mouse().x, mouse().y],
    resolution: [dimensions.width, dimensions.height]
  });
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
