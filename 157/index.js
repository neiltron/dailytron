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

const RADIUS = 256;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 15,
  theta: -Math.PI * .5,
  phi: Math.PI * .01,
  mouse: true,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  // primitive: 'points',
  count: 3,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    texture: regl.prop('img')
  },

  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },

  blend: {
    enable: true,
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
    drawPoints({
      img: img,
      resolution: [dimensions.width, dimensions.height],
      img: img,
      tick: tick
    });
  });
}



let img = document.createElement('img');
img.onload = () => {
  img = regl.texture({
    data: img,
    wrap: ['clamp', 'clamp'],
    width: 200,
    height: 200,
  });

  regl.frame(render);
}
img.src = './cat3.png';
