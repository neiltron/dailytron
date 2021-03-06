import { vec2, mat4 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import Camera from './src/camera';
import SphereMesh from 'primitive-icosphere';

let regl = new Regl(canvas);
const camera = Camera(regl);

// let textBuffer = regl.framebuffer({
//   width: Math.floor(dimensions.width),
//   height: Math.floor(dimensions.height)
// })

const sphereMesh = SphereMesh(.5, {
  subdivisions: 1
});


document.body.appendChild(canvas);

const drawSphere = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  elements: sphereMesh.cells,
  depth: { enable: false },
  // primitive: 'line strip',
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
    model: regl.prop('model'),
    src: regl.prop('src'),
    offset: regl.prop('offset'),
    color: regl.prop('color'),
    lines: false
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

const drawSphereLines = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  elements: sphereMesh.cells,
  depth: { enable: false },
  primitive: 'line strip',
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

for (let i = 0; i < 2; i++) {
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
    drawSphere(layers);
    drawSphereLines(layers);
  });

  // updatePixels({
  //   textSrc: textBuffer
  // });

}

regl.frame(render);