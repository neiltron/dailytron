import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let regl = new Regl(canvas);

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

document.body.appendChild(canvas);

const drawCircle = regl({
  frag: glslify('./src/circle.frag'),
  vert: glslify('./src/circle.vert'),
  count: 3,
  elements: null,
  depth: { enable: false },
  framebuffer: regl.prop('dest'),

  attributes: {
    position: [
      0, -4,
      4, 4,
      -4, 4
    ]
  },

  uniforms: {
    state: regl.prop('src'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})

const updatePixels = regl({
  frag: glslify('./src/shader2.frag'),
  vert: glslify('./src/shader2.vert'),
  count: 3,
  elements: null,
  depth: { enable: false },

  attributes: {
    position: [
      0, -4,
      4, 4,
      -4, 4
    ]
  },

  uniforms: {
    state: regl.prop('src'),
    circleSrc: regl.prop('circleSrc'),
    mouseSrc: regl.prop('mouseSrc'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})

let positions;

let render = function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  drawCircle({
    dest: circleBuffer,
    mousepos: [mouse.position[0], mouse.position[1]],
    resolution: [canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio]
  });

  updatePixels({
    circleSrc: circleBuffer,
    mousepos: [mouse.position[0], mouse.position[1]],
    resolution: [canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio],
  })
}

regl.frame(render);
mouse.moveCallbacks.push(render);