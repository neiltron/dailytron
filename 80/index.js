import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import cubeMesh from 'primitive-cube';
import Camera from './src/camera';
import vectorizeText from 'vectorize-text';

let regl = new Regl(canvas);
const camera = Camera(regl);

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

let textBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

const textMesh = vectorizeText('WHAT', {
  width: 1.5,
  triangles: true,
  textAlign: 'center',
  textBaseline: 'middle',
  fontWeight: '900',
  font: 'helvetica neue'
});

const mesh = cubeMesh(1, 1, 1, 1, 1, 1);
const boxCount = 420;
const sqrt = Math.sqrt(boxCount);
const center = sqrt / 2;

const boxes = Array(boxCount)
              .fill([0, 0, 0])
              .map((box, i) => {
                return [
                  Math.floor(i % 12),
                  Math.floor(i / 12) - 8,
                  0
                  // Math.floor(i % 2) * 2
                ];
              });

const distances = Array(boxCount)
                    .fill(0)
                    .map((distance, i) => {
                      let row = Math.floor(i / sqrt);
                      let column = i % sqrt;

                      distance = Math.pow(center - row, 2) + Math.pow(center - column, 2);

                      return distance / 500;
                    });

document.body.appendChild(canvas);

const drawCube = regl({
  frag: glslify('./src/cube.frag'),
  vert: glslify('./src/cube.vert'),
  elements: mesh.cells,
  depth: { enable: false },
  primitive: 'line loop',
  framebuffer: regl.prop('dest'),

  attributes: {
    position: mesh.positions,
    normal: mesh.normals
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    pos: regl.prop('pos')
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

const drawPlane = regl({
  frag: glslify('./src/cube_color.frag'),
  vert: glslify('./src/cube.vert'),
  elements: mesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',
  framebuffer: regl.prop('dest'),

  attributes: {
    position: mesh.positions,
    normal: mesh.normals
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    pos: regl.prop('pos')
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

const drawText = regl({
  frag: glslify('./src/text.frag'),
  vert: glslify('./src/text.vert'),
  elements: textMesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',
  framebuffer: regl.prop('dest'),

  attributes: {
    position: textMesh.positions
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    src: regl.prop('src')
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


let time = null;

const _boxes = boxes.map((box, i) => {
  return {
    pos: box,
    dest: circleBuffer
  }
});

let render = function () {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  circleBuffer.resize(1, 1);
  circleBuffer.resize(dimensions.width, dimensions.height);

  textBuffer.resize(1, 1);
  textBuffer.resize(dimensions.width, dimensions.height);

  camera(() => {
    drawCube(_boxes);
    drawPlane(_boxes);

    drawText({
      src: circleBuffer,
      dest: textBuffer
    });

    updatePixels({
      src: circleBuffer,
      textSrc: textBuffer,
    });
  });

}

regl.frame(render);
// mouse.moveCallbacks.push(render);