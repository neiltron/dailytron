import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import generateCylinderMesh from './src/cylinder-mesh';
import scene from './src/scene';
import normals from 'angle-normals';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

const setupScene = scene(regl);

document.body.appendChild(canvas);

const mesh = generateCylinderMesh(50, 1000, 32);

const setContext = regl({
  uniforms: {
    u_mousepos: regl.prop('mousepos')
  }
});

const drawPoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  depth: { enable: true },
  // primitive: 'lines',

  elements: mesh.cells,
  count: mesh.positions.length,

  attributes: {
    position: mesh.positions,
    normal: normals(mesh.cells, mesh.positions),
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
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
let rows = 10;
let columns = 1;
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
  setupScene(({ tick }) => {
    setContext({
      mousepos: mouse.position
    }, () => {
      drawPoints(spheres);
    })
  });
}

regl.frame(render);