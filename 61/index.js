import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import quadMesh from 'primitive-quad';
import Camera from './src/camera';

const regl = new Regl(canvas);
const camera = Camera(regl);
const mesh = quadMesh([.1, 5]);
const boxCount = 20;
const sqrt = Math.sqrt(boxCount);
const center = sqrt / 2;

const boxes = Array(boxCount)
              .fill([0, 0, 0])
              .map((box, i) => {
                return [
                  0,
                  Math.floor(i * 5 * 3),
                  0
                ];
              });

const buffer = regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture()
})

document.body.appendChild(canvas);

const drawCube = regl({
  frag: glslify('./src/cube.frag'),
  vert: glslify('./src/cube.vert'),
  elements: mesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',
  // framebuffer: buffer,

  attributes: {
    position: mesh.positions,
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
  },
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
    // u_mousepos: regl.prop('mousepos'),
    // u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})


let time = null;

const boxData = boxes.map((box, i) => {
  return {
    pos: box,
    resolution: [dimensions.width, dimensions.height]
  };
});


let render = function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  camera(() => {
    drawCube(boxData);
  });

  // updatePixels({ src: buffer });
}

regl.frame(render);