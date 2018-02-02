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
  distance: 60,
  // phi: Math.PI * .2,
  // theta: Math.PI * .5,
  // mouse: false,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});


const points = 40;
const radius = .4;
const TAU = Math.PI * 2;
const pointsPerLayer = 5;
const step = TAU / pointsPerLayer;
let angle = 0;

const line = Array(points).fill([0, 0, 0]).map((el, index) => {
  const _index = index / pointsPerLayer;

  if (index % pointsPerLayer === 0) {
    angle = 0;
  }

  const vector = [
    Math.sin(angle) * radius - (radius / 2),
    Math.floor(_index),
    Math.cos(angle) * radius - (radius / 2)
  ];

  angle += step;

  return vector;

});
const cells = [];

for (let i = 0; i < points / 2; i += 5) {
  cells.push(0 + i, 1 + i, 5 + i);
  cells.push(1 + i, 2 + i, 6 + i);
  cells.push(2 + i, 3 + i, 7 + i);
  cells.push(3 + i, 4 + i, 8 + i);
  cells.push(4 + i, 0 + i, 9 + i);

  cells.push(1 + i, 5 + i, 6 + i);
  cells.push(2 + i, 6 + i, 7 + i);
  cells.push(3 + i, 7 + i, 8 + i);
  cells.push(4 + i, 8 + i, 9 + i);
  cells.push(0 + i, 9 + i, 5 + i);
}

const drawPoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  depth: { enable: true },
  // primitive: 'line loop',

  elements: cells,
  count: cells.length,

  attributes: {
    position: line,
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    u_pixel_ratio: regl.prop('pixelRatio'),
    u_offset: regl.prop('offset'),
    u_column: regl.prop('column'),
    u_row: regl.prop('row'),
    u_total_columns: regl.prop('total_columns'),
    u_total_rows: regl.prop('total_rows'),
  },

  cull: {
    enable: false,
    face: 'back'
  },

  blend: {
    enable: false,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 1,
      dstAlpha: 1
    },
    equation: { rgb: 'add', alpha: 'add' }
  },
});

let spheres = [];
let rows = 50;
let columns = 50;

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    for (let sphere = 0; sphere < 1; sphere++) {
      spheres.push({
        resolution: [dimensions.width, dimensions.height],
        total_rows: rows,
        total_columns: columns,
        column,
        row,
        offset: sphere,
        pixelRatio: window.devicePixelRatio,
      })
    }
  }
}


let render = function ({ tick }) {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })


  camera(({ tick }) => {
    drawPoints(spheres);
  });
}


regl.frame(render);