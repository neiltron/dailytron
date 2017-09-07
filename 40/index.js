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
  distance: 30,
  theta: Math.PI * 1.5,
  phi: Math.PI,
  mouse: false
});

const mesh = quadMesh();
const boxCount = 2500;
const sqrt = Math.sqrt(boxCount);
const center = sqrt / 2;

const boxes = Array(boxCount)
              .fill([0, 0, 0])
              .map((box, i) => {
                return [
                  (i % sqrt * 2) - sqrt + 1,
                  (i / sqrt * 2) - sqrt - (i % sqrt) / 5,
                  0
                ];
              });

const coords = Array(boxCount)
                    .fill(0)
                    .map((box, i) => {
                      let row = Math.floor(i / sqrt);
                      let column = i % sqrt;

                      return [row, column];
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
    boxes[i][0] = Math.sin(i) * (Math.PI * coords[i][0]) * (((Math.sin(time) + 1) / 2) * time);
    boxes[i][1] = Math.cos(i) * (Math.PI * coords[i][1]) * (((Math.cos(time) + 1) / 2) * time);
    boxes[i][2] = Math.sin(coords[i][0]) * Math.cos(coords[i][1]) * time * 100;

    // boxes[i][2] = Math.sin((coords[i][1] + center) * time / 10)
    // boxes[i][2] = ((Math.sin((((coords[i][1] + 1) * (coords[i][1] + 1)) / sqrt) * (time / 10)) + 1) / 2) * 20;
    // boxes[i][2] = (((Math.sin((coords[i][0] + 1) / (sqrt / 5)) * Math.cos((coords[i][1] + 1) / (sqrt / 5))) * time)) * 10;
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