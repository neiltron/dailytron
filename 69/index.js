import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import quadMesh from 'primitive-quad';
import Camera from './src/camera';
import vectorizeText from 'vectorize-text';

let regl = new Regl(canvas);
const camera = Camera(regl);

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

// const mesh = quadMesh([1, 1]);
// const boxCount = 5000;
// const sqrt = Math.sqrt(boxCount);
// const center = sqrt / 2;

// const boxes = Array(boxCount)
//               .fill([0, 0, 0])
//               .map((box, i) => {
//                 return [
//                   Math.floor(i * 2 % 60) / 2 - (33 * (i % 2)) + 2,
//                   Math.floor(i * 2 / 60) - 8,
//                   0
//                 ];
//               });

// const distances = Array(boxCount)
//                     .fill(0)
//                     .map((distance, i) => {
//                       let row = Math.floor(i / sqrt);
//                       let column = i % sqrt;

//                       distance = Math.pow(center - row, 2) + Math.pow(center - column, 2);

//                       return distance / 500;
//                     });

const mesh = vectorizeText('what', {
  width: 1,
  triangles: true,
  textAlign: 'center',
  textBaseline: 'middle',
  font: 'helvetica'
});

document.body.appendChild(canvas);

console.log(mesh);

const drawCube = regl({
  frag: glslify('./src/cube.frag'),
  vert: glslify('./src/cube.vert'),
  elements: mesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',
  framebuffer: circleBuffer,

  attributes: {
    position: mesh.positions
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: regl.prop('resolution')
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
    // u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})


let time = null;

let render = function () {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  circleBuffer.resize(1, 1);
  circleBuffer.resize(dimensions.width, dimensions.height);

  camera(() => {
    drawCube();
  });

  updatePixels({
    src: circleBuffer,
    resolution: [dimensions.width, dimensions.height]
  });
}

regl.frame(render);
// mouse.moveCallbacks.push(render);