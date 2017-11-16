import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import createCube from 'primitive-cube';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 256;

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

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  theta: Math.PI / -2,
  phi: 0,
  mouse: true
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

const state = createFBOs(RADIUS, RADIUS, (p, i) => {
  if (i % 0 === 0) {
    return 0;
  } else {
    return .5;
  }
});
const inertiaState = createFBOs(RADIUS, RADIUS, (p, i) => {
  return ((Math.random() - .5) * 2) * Math.sin(i) * Math.cos(i);
});
const speedState = createFBOs(RADIUS, RADIUS, (p, i) => {
    return ((Math.random() - .5) * 2) * i;
});

const updatePositions = regl({
  vert: glslify('./src/update_positions.vert'),
  frag: glslify('./src/update_positions.frag'),

  framebuffer: regl.prop('dest'),
  count: 3,
  depth: { enable: false },

  uniforms: {
    src: regl.prop('src'),
    speed: regl.prop('speed'),
    time: regl.context('time'),
    radius: RADIUS,
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution')
  },

  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
})

const updateInertia = regl({
  vert: glslify('./src/update_inertia.vert'),
  frag: glslify('./src/update_inertia.frag'),

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

const updateSpeed = regl({
  vert: glslify('./src/update_speed.vert'),
  frag: glslify('./src/update_speed.frag'),

  framebuffer: regl.prop('dest'),
  count: 3,
  depth: { enable: false },


  uniforms: {
    src: regl.prop('src'),
    position: regl.prop('position'),
    prevPosition: regl.prop('prevPosition'),
    inertia: regl.prop('inertia'),
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

  primitive: 'points',
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

  updateInertia({
    src: inertiaState[tick % 2],
    dest: inertiaState[(tick + 1) % 2],
    resolution: [dimensions.width, dimensions.height]
  });

  updateSpeed({
    src: speedState[tick % 2],
    dest: speedState[(tick + 1) % 2],
    position: state[tick % 2],
    prevPosition: state[(tick + 1) % 2],
    inertia: inertiaState[(tick + 1) % 2],
    resolution: [dimensions.width, dimensions.height]
  });

  updatePositions({
    src: state[tick % 2],
    dest: state[(tick + 1) % 2],
    speed: speedState[(tick + 1) % 2],
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
