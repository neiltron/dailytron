import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import SphereMesh from 'primitive-icosphere';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 15;
const fbo = regl.framebuffer({
  width: dimensions.width,
  height: dimensions.height,
  stencil: false
})

const sphereMesh = SphereMesh(3, {
  subdivisions: 3
});

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  // theta: Math.PI * .5,
  phi: Math.PI * -.05,
  // mouse: false,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

let amplitude = 4;
let scrollPos = 1;

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



const line = Array(40).fill([0, 0, 0]).map((el, index) => [.01 * (index % 2 ? 1 : -1), .2 * Math.floor(index / 2.0), 0]);
const cells = [];

console.log(line);

for (let i = 0; i < 20; i += 2) {
  cells.push(0 + i, 1 + i, 2 + i);
  cells.push(1 + i, 2 + i, 3 + i);
}


const drawSphere = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  elements: sphereMesh.cells,
  depth: { enable: false },
  primitive: 'triangle',

  // framebuffer: regl.prop('dest'),

  attributes: {
    position: sphereMesh.positions,
    uv: sphereMesh.uvs,
    normal: sphereMesh.normals,
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    u_texture: regl.prop('img'),
    u_scroll_pos: regl.prop('scrollPos'),
    u_amplitude: regl.prop('amplitude'),
    u_pixel_ratio: regl.prop('pixelRatio'),
    lines: false,
    u_offset: regl.prop('offset'),
    u_column: regl.prop('column'),
    u_row: regl.prop('row'),
  },

  cull: {
    enable: true,
    face: 'back'
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
  }
});

const drawPoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  depth: { enable: false },
  primitive: 'triangle strip',

  elements: cells,
  count: 28,

  attributes: {
    position: line,
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    u_texture: regl.prop('img'),
    u_scroll_pos: regl.prop('scrollPos'),
    u_amplitude: regl.prop('amplitude'),
    u_pixel_ratio: regl.prop('pixelRatio'),
    lines: false,
    u_offset: regl.prop('offset'),
    u_column: regl.prop('column'),
    u_row: regl.prop('row'),
  },

  cull: {
    enable: false,
    face: 'back'
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
  }
});

let spheres = [];

for (let row = 0; row < 5; row++) {
  for (let column = 0; column < 5; column++) {
    for (let sphere = 0; sphere < 1; sphere++) {
      spheres.push({
        mousepos: mouse.position,
        resolution: [dimensions.width, dimensions.height],
        column,
        row,
        offset: sphere,
        img,
        scrollPos,
        amplitude,
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
    // drawSphere(spheres);
    drawPoints(spheres);
  });
}

document.addEventListener('wheel', (e) => {
  amplitude += e.deltaY / 500;

  amplitude = Math.min(amplitude, 4);
  amplitude = Math.max(amplitude, .2);
});


var img = new Image();

img.onload = function() {
  img = regl.texture(img);

  regl.frame(render);
}

img.src = './cat3.png';