import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 5;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 50,
  theta: Math.PI * .5,
  // phi: Math.PI * .01,
  mouse: true,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

function particleLookup (width, height) {
  return new Array(width * height).fill(0).map((d, i) => {
    const row = i % width;
    const column = Math.floor(i / width);

    return [
      row / Math.max(1, width - 1),
      column / (height - 1)
    ];
  });
}


const initialTriangle = [
  [0, 0],
  [4, 0],
  [0, 4],
  [4, 0],
  [0, 4],
  [4, 4],

];
let lastTriangle = initialTriangle;

let xy = [];

for (let column = 0; column < RADIUS; column++) {
  for (let row = 0; row < RADIUS * 2; row++) {
    const referenceTriangle = row === 0 ? initialTriangle : lastTriangle;

    const newTriangle = [
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[0][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[1][1] + 4],
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[2][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[3][1] + 4],
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[4][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[5][1] + 4],
    ];

    xy.push(newTriangle[0]);
    xy.push(newTriangle[1]);
    xy.push(newTriangle[2]);
    xy.push(newTriangle[3]);
    xy.push(newTriangle[4]);
    xy.push(newTriangle[5]);

    lastTriangle = newTriangle;
  }
}

const drawTriangle = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  // primitive: 'triangle',
  count: xy.length,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: false
  },

  attributes: {
    xy: [
      xy
    ]
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

const drawLines = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'lines',
  count: xy.length,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: true
  },

  attributes: {
    xy: [
      xy
    ]
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


let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  camera(() => {
    drawTriangle({
      resolution: [dimensions.width, dimensions.height],
      tick: tick
    });

    drawLines({
      lines: true,
      resolution: [dimensions.width, dimensions.height],
      tick: tick
    });
  });
}


regl.frame(render);
