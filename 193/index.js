import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  // mouse: false,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

const line = Array(40).fill([0, 0, 0]).map((el, index) => [.01 * (index % 2 ? 1 : -1), .2 * Math.floor(index / 2.0), 0]);
const cells = [];

for (let i = 0; i < 20; i += 2) {
  cells.push(0 + i, 1 + i, 2 + i);
  cells.push(1 + i, 2 + i, 3 + i);
}


const drawPoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  depth: { enable: false },
  primitive: 'triangle strip',

  elements: cells,
  count: 28,

  attributes: {
    position: line,
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_pixel_ratio: regl.prop('pixelRatio'),
    u_offset: regl.prop('offset'),
    u_column: regl.prop('column'),
    u_row: regl.prop('row'),
  },

  cull: {
    enable: false,
    face: 'back'
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
});

let spheres = [];

for (let row = 0; row < 5; row++) {
  for (let column = 0; column < 5; column++) {
    for (let sphere = 0; sphere < 1; sphere++) {
      spheres.push({
        resolution: [dimensions.width, dimensions.height],
        column,
        row,
        offset: sphere,
        pixelRatio: window.devicePixelRatio,
      })
    }
  }
}


let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  camera(({ tick }) => {
    drawPoints(spheres);
  });
}


regl.frame(render);