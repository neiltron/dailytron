import { vec2 } from 'gl-matrix';
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

const RADIUS = 512;

const camera = require('regl-camera')(regl, {
  center: [0, 30, 0],
  distance: 20,
  theta: Math.PI * 1.25,
  phi: .2,
  mouse: true,
  damping: .00001,
  rotationSpeed: .25
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

const createFBOs = (width, height, fn) => {
  fn = fn || function (p, i) { return Math.random(); };

  const texture = new Float32Array(width * height * 4).fill(1).map(fn);

  return new Array(2).fill(0).map(() => regl.framebuffer({
    depthStencil: false,
    colorType: 'float',
    color: regl.texture({
      width: width,
      height: height,
      data: texture,
      type: 'float32',
      wrap: 'repeat',
      type: 'float'
    })
  }));
}


const state = createFBOs(RADIUS, RADIUS, (p, i) => {
  if (i % 4 === 0) {
    return Math.floor(i / RADIUS);
  } else if (i % 4 === 1) {
    return Math.floor(i % RADIUS);
  } else if (i % 4 === 2) {
    return Math.random();
  } else {
    return 0;
  }
});

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'points',
  count: RADIUS * RADIUS,
  depth: { enable: false },

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
});

let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  camera(() => {
    updatePositions({
      src: state[tick % 2],
      dest: state[(tick + 1) % 2],
      mousepos: mouse.position,
      resolution: [dimensions.width, dimensions.height]
    });

    drawPoints({
      src: state[(tick + 1) % 2],
      resolution: [dimensions.width, dimensions.height],
    });
  });
}


let img = document.createElement('img');
img.onload = () => {
  img = regl.texture(img);

  regl.frame(render);
}
img.src = './reflection.png';
