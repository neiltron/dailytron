import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float'],
  optionalExtensions: ['oes_texture_float_linear', 'OES_texture_half_float']
});

const RADIUS = dimensions.width > 800 ? 256 : 64;
const TEXTURE_DATA = (Array(RADIUS * RADIUS * 4)).fill(1).map((p, i) => {
  angle = i / (RADIUS / 2);

  if (i % 4 == 0) {
    return Math.sin(angle);
  } else if (i % 4 == 1) {
    return Math.cos(angle);
  } else if (i % 4 == 2) {
    return angle / 10;
  } else {
    return 0;
  }
});


const camera = require('regl-camera')(regl, {
  center: [0, 220, 0],
  distance: 0,
  theta: Math.PI / 2,
  phi: Math.PI / 2,
  mouse: true,
  // far: 500
});

let angle = 0;

const state = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture({
    data: TEXTURE_DATA,
    radius: RADIUS,
    type: dimensions.width > 800 ? 'float' : 'half float'
  })
}))

function particleLookup (w, h) {
  return new Array(w * h).fill(0).map((d, i) => [
    (i % w) / Math.max(1, w - 1),
    Math.floor(i / w) / (h - 1)
  ]);
}

document.body.appendChild(canvas);

const updatePositions = regl({
  vert: glslify('./src/update_positions.vert'),
  frag: glslify('./src/update_positions.frag'),

  framebuffer: regl.prop('dest'),
  count: 3,
  depth: { enable: false },

  uniforms: {
    src: regl.prop('src'),
    time: regl.context('time'),
    radius: RADIUS
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
    position: regl.prop('src'),
    time: regl.context('time')
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