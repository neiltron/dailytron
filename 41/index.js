import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import quadMesh from 'primitive-quad';

let regl = new Regl(canvas);

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 140,
  theta: Math.PI * 1.5,
  phi: Math.PI * -.3,
  mouse: false
});

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

const mesh = quadMesh();
const boxCount = 6400;
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

let render = function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  circleBuffer.resize(1, 1);
  circleBuffer.resize(dimensions.width, dimensions.height);

  time = Math.cos(Date.now() / 2000);

  for (var i = 0, total = boxCount; i < total; i++) {
    boxes[i][2] = ((Math.sin(distances[i] * time) + 1) / 1000) * 10000;
  }

  camera(() => {
    drawCube(boxes.map((box, i) => {
      return {
        pos: box,
        dest: circleBuffer
      }
    }));
  });

  updatePixels({
    src: circleBuffer,
    mousepos: [mouse.position[0], mouse.position[1]],
    resolution: [dimensions.width, dimensions.height],
  })
}

regl.frame(render);
// mouse.moveCallbacks.push(render);