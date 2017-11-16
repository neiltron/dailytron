import { vec2, mat4 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import Camera from './src/camera';
import SphereMesh from 'primitive-icosphere';
import triangulate from 'delaunay-triangulate';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float']
});

const camera = Camera(regl);

// let textBuffer = regl.framebuffer({
//   width: Math.floor(dimensions.width),
//   height: Math.floor(dimensions.height)
// })


let positions = [];
let lines = 1000;

let pos = [0, 0, 0];

for (let i = 0; i < lines; i++) {
  positions[i] = pos;

  pos = [(Math.random() - .5) * 10, (Math.random() - .5) * 10, (Math.random() - .5) * 10];
}

document.body.appendChild(canvas);

const drawSpherePoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  // elements: triangles,
  depth: { enable: false },
  // primitive: 'points',
  count: positions.length,

  // framebuffer: regl.prop('dest'),

  attributes: {
    position: positions,
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    model: regl.prop('model'),
    src: regl.prop('src'),
    offset: regl.prop('offset'),
    color: regl.prop('color'),
    lines: true
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
    src: regl.prop('src'),
    textSrc: regl.prop('textSrc'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})

let layers = [];
let model = mat4.identity([]);

for (let i = 0; i < 1; i++) {
  layers.push(
    {
      // dest: textBuffer,
      model: model,
      offset: i + 1,
      mousepos: mouse.position,
      resolution: [dimensions.width, dimensions.height]
    }
  )
}

let render = function () {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  // textBuffer.resize(1, 1);
  // textBuffer.resize(dimensions.width * 2, dimensions.height * 2);

  camera(() => {
    drawSpherePoints(layers);
  });

  // updatePixels({
    // textSrc: textBuffer
  // });

}

regl.frame(render);