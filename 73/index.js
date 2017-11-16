import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let circleTotal = 10;
let circles = [];

document.body.appendChild(canvas);
let regl = new Regl(canvas);

for (let i = 0; i < circleTotal; i++)  {
  circles.push({
    index: i
  });
}


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
    // src: regl.prop('src'),
    u_index: regl.prop('index'),
    u_color: regl.prop('color'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  },

  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 1,
      dstAlpha: 1
    },
    equation: {rgb: 'add', alpha: 'add'}
  }
})

const colors = [
  [255, 255, 255],
  [0, 0, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 0],
  [255, 0, 255]
]


regl.frame(() => {

  drawCanvas(circles.map((circle) => {
    return {
      index: circle.index,
      color: colors[circle.index],
      mousepos: [mouse().x, mouse().y],
      resolution: [dimensions.width, dimensions.height]
    };
  }));
});


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
