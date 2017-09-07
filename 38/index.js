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
  center: [0, 2.5, 0],
  distance: 150,
  theta: Math.PI / 2,
  phi: Math.PI / -2,
  mouse: false
});

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
  }
})


let time = null;

let render = function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  time = Math.cos(Date.now() / 2000);

  for (var i = 0, total = boxCount; i < total; i++) {
    boxes[i][2] = ((Math.sin(distances[i] * time) + 1) / 1000) * 10000;
  }

  camera(() => {
    drawCube(boxes.map((box, i) => {
      return {
        pos: box
      }
    }));
  });
}

regl.frame(render);
// mouse.moveCallbacks.push(render);