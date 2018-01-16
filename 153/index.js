import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import pressed from "pressed"


pressed.start()

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 256;
let x = 0;
let y = 0;

const camera = require('regl-camera')(regl, {
  center: [-110, 5, -20],
  distance: 120,
  theta: -Math.PI / 1.3,
  // phi: Math.PI,
  mouse: true,
  damping: .00001,
  far: 1000000,
  // rotationSpeed: .25,
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
  depthStencil: false,
  colorType: 'float'
});

const pointBuffer = regl.framebuffer({
  depthStencil: false,
  colorType: 'float'
});

const updatePoints = regl({
  vert: glslify('./src/update_points.vert'),
  frag: glslify('./src/update_points.frag'),

  primitive: 'points',
  count: RADIUS * RADIUS,
  depth: { enable: false },
  framebuffer: regl.prop('dest'),

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    u_offset: regl.prop('offset'),
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

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  count: RADIUS * RADIUS,
  primitive: 'points',
  depth: { enable: false },
  // framebuffer: regl.prop('dest'),

  uniforms: {
    time: regl.context('time'),
    src: regl.prop('src'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    u_offset: regl.prop('offset'),
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


  const increment = .005;

  if (pressed("w") || pressed(38)) {
    x += increment;
    y += increment;
  } else if (pressed("s") || pressed(40)) {
    x -= increment;
    y -= increment;
  }

  if (pressed("a") || pressed(37)) {
    x += increment;
    y -= increment;
  } else if (pressed("d") || pressed(39)) {
    x -= increment;
    y += increment;
  }

  buffer.resize(1, 1);
  buffer.resize(dimensions.width, dimensions.height);

  pointBuffer.resize(1, 1);
  pointBuffer.resize(dimensions.width, dimensions.height);

  camera(() => {
    updatePoints({
      resolution: [dimensions.width, dimensions.height],
      mousepos: mouse.position,
      offset: [x, y],
      dest: buffer
    });

    drawPoints({
      resolution: [dimensions.width, dimensions.height],
      mousepos: mouse.position,
      offset: [x, y],
      src: buffer,
      dest: pointBuffer
    })

    // drawBlur({
    //   src: pointBuffer
    // });
  });
}


regl.frame(render);
