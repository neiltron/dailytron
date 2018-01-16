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

const RADIUS = 128;

const camera = require('regl-camera')(regl, {
  center: [3, 6, 0],
  distance: 0,
  theta: -Math.PI,
  phi: Math.PI / 5,
  mouse: true,
  damping: .00001,
  far: 1000000,
  rotationSpeed: .25,
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

const buffer = regl.framebuffer({
  depthStencil: false
});

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'triangle fan',
  count: RADIUS * RADIUS,
  depth: { enable: false },
  framebuffer: regl.prop('dest'),

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
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

const drawBlur = regl({
  vert: glslify('./src/blur.vert'),
  frag: glslify('./src/blur.frag'),

  count: 3,
  depth: { enable: false },

  uniforms: {
    src: regl.prop('src'),
    time: regl.context('time')
  },

  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
});

let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  buffer.resize(1, 1);
  buffer.resize(dimensions.width, dimensions.height);

  camera(() => {
    drawPoints({
      resolution: [dimensions.width, dimensions.height],
      dest: buffer
    });

    drawBlur({
      src: buffer
    });
  });
}


let img = document.createElement('img');
img.onload = () => {
  img = regl.texture(img);

  regl.frame(render);
}
img.src = './reflection.png';
