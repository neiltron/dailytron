import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import createCube from 'primitive-cube';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float'],
  optionalExtensions: ['oes_texture_float_linear', 'OES_texture_half_float']
});

const RADIUS = 128;

let t_canvas = document.createElement('canvas');
t_canvas.width = RADIUS * 2;
t_canvas.height = RADIUS * 2;
let t_ctx = t_canvas.getContext('2d');

const imageData = t_ctx.createImageData(RADIUS * 2, RADIUS * 2);
const TEXTURE_DATA = (new Float32Array(RADIUS * RADIUS * 4)).fill(1);

imageData.data.set(TEXTURE_DATA);
t_ctx.putImageData(imageData, 0, 0);

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  theta: Math.PI / -2,
  phi: 0,
  mouse: true
});

const state = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture(t_canvas)
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
    radius: RADIUS,
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution')
  },

  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
})

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'triangle strip',
  count: RADIUS * RADIUS,
  depth: {enable: false},

  uniforms: {
    position: regl.prop('src'),
    time: regl.context('time'),
    u_resolution: regl.prop('resolution')
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
    dest: state[(tick + 1) % 2],
    mousepos: mouse.position,
    resolution: [dimensions.width, dimensions.height]
  });

  camera(() => {
    drawPoints({
      src: state[(tick + 1) % 2],
      resolution: [dimensions.width, dimensions.height]
    });
  });
}

regl.frame(render);
