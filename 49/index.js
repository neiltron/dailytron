import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import createCube from 'primitive-cube';

let regl = new Regl({
  canvas: canvas,
  extensions: ['oes_texture_float'],
});

const RADIUS = dimensions.width > 128 ? 256 : 64;
const camera = require('regl-camera')(regl, {
  center: [50, 0, 300],
  distance: 300,
  theta: 0,
  phi: Math.PI / 10,
  mouse: false,
  far: 500
});



const state = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  color: regl.texture({
    data: new Array(RADIUS * RADIUS * 4).fill(0).map((pixel, i) => {
      if (i % 4 == 0) {
        return i / RADIUS;
      } else if (i % 4 == 1) {
        return i % RADIUS;
      } else {
        return 1;
      }
    }),
    radius: RADIUS,
    type: 'float'
  })
}))

function particleLookup (w, h) {
  return new Array(w * h).fill(0).map((d, i) => [
    (i % w) / Math.max(1, w - 1),
    Math.floor(i / w) / (h - 1)
  ]);
}

const boxCount = 10000;
const sqrt = Math.sqrt(boxCount);

document.body.appendChild(canvas);

const updatePositions = regl({
  vert: glslify('./src/update_positions.vert'),
  frag: glslify('./src/update_positions.frag'),

  framebuffer: regl.prop('dest'),
  count: 3,
  depth: { enable: false },

  uniforms: {
    src: regl.prop('src'),
    time: regl.context('time')
  },

  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
})

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'points',
  count: RADIUS * RADIUS,
  depth: {enable: false},

  uniforms: {
    position: regl.prop('src')
  },

  attributes: {
    uv: particleLookup(RADIUS, RADIUS)
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
  },
});

let render = function ({ tick }) {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  updatePositions({
    src: state[tick % 2],
    dest: state[(tick + 1) % 2]
  });

  camera(() => {
    drawPoints({
      src: state[(tick + 1) % 2]
    });
  });
}

regl.frame(render);