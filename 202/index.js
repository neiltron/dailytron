import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
// import generateCylinderMesh from 'cylinder-mesh';


const generateCylinderMesh = (radius = 1, height = 1, sides = 5) => {
  const points = sides * height * 6;
  const step = (Math.PI * 2) / sides;
  let angle = 0;


  // generate points
  const positions = Array(points).fill([0, 0, 0]).map((el, index) => {
    const _index = index / sides;

    if (index % sides === 0) {
      angle = 0;
    }

    const vector = [
      (Math.sin(angle)),
      Math.floor(_index),
      (Math.cos(angle))
    ];

    angle += step;

    return vector;

  });

  // connect lines with cells
  const cells = [];

  for (let i = 0; i < points / 2; i += sides) {
    for (let j = 0; j < sides; j++) {
      if (j === sides - 1) {
        cells.push(0 + j + i, sides * i, sides + j + i);
        cells.push(sides * i, sides + j + i, 1 + j + i);
      } else {
        cells.push(0 + j + i, 1 + j + i, sides + j + i);
        cells.push(1 + j + i, sides + j + i, (sides + 1) + j + i);
      }
    }
  }

  return {
    positions,
    cells
  };
};


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 140,
  phi: Math.PI * .1,
  // theta: Math.PI * .5,
  // mouse: false,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});


const mesh = generateCylinderMesh(1, 1, 6);
console.log(mesh);

const drawPoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  depth: { enable: true },
  // primitive: 'line loop',

  elements: mesh.cells,
  count: mesh.positions.length,

  attributes: {
    position: mesh.positions,
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
let rows = 80;
let columns = 50;
let sphereCount = 1;

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    for (let sphere = 0; sphere < sphereCount; sphere++) {
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