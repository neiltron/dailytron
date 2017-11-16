import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import Camera from './src/camera';
import vectorizeText from 'vectorize-text';

let regl = new Regl(canvas);
const camera = Camera(regl);

let textBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

const textMesh = vectorizeText('WHAT', {
  height: .456,
  size: 200,
  triangles: true,
  textAlign: 'center',
  textBaseline: 'middle',
  fontWeight: '900',
  font: 'helvetica'
});


document.body.appendChild(canvas);


const drawText = regl({
  frag: glslify('./src/text.frag'),
  vert: glslify('./src/text.vert'),
  elements: textMesh.cells,
  depth: { enable: false },
  // primitive: 'line strip',
  // framebuffer: regl.prop('dest'),

  attributes: {
    position: textMesh.positions
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_mousepos: regl.prop('mousepos'),
    src: regl.prop('src'),
    offset: regl.prop('offset'),
    color: regl.prop('color'),
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

for (let i = 0; i < 40; i++) {
  layers.push(
    {
      dest: textBuffer,
      offset: i,
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
    drawText(layers);
  });

  // updatePixels({
  //   textSrc: textBuffer
  // });

}

regl.frame(render);