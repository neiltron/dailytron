import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import quadMesh from 'primitive-quad';
import createCube from 'primitive-cube';

let regl = new Regl(canvas);

const camera = require('regl-camera')(regl, {
  center: [0, -50, 0],
  distance: 50,
  theta: Math.PI * 1.5,
  phi: -Math.PI / 2,
  mouse: false
});

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

const mesh = quadMesh();
const cubeMesh = createCube(2, 2, 2, 1, 1, 1);
const boxCount = 10000;
const sqrt = Math.sqrt(boxCount);
const center = sqrt / 2;

const boxes = Array(boxCount)
              .fill([0, 0, 0])
              .map((box, i) => {
                return [
                  (i % sqrt * 2) - sqrt,
                  (i / sqrt * 2) - sqrt,
                  0
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

const drawQuad = regl({
  frag: glslify('./src/quad.frag'),
  vert: glslify('./src/quad.vert'),
  elements: mesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',

  attributes: {
    position: mesh.positions,
    normal: mesh.normals
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    pos: regl.prop('pos')
  }
});

const drawCube = regl({
  frag: glslify('./src/cube.frag'),
  vert: glslify('./src/cube.vert'),
  elements: cubeMesh.cells,
  depth: { enable: false },
  primitive: 'line loop',

  attributes: {
    position: cubeMesh.positions,
    normal: cubeMesh.normals,
    uv: cubeMesh.uvs
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    pos: regl.prop('pos')
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
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
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
    // drawQuad(boxData);
    drawCube(boxData);
  });
}

regl.frame(render);
// mouse.moveCallbacks.push(render);