import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import Camera from './src/camera';

let circleTotal = 15;
let circles = [];

document.body.appendChild(canvas);
let regl = new Regl(canvas);
let camera = Camera(regl);

for (let i = 0; i < circleTotal; i++)  {
  circles.push({
    z: i
  });
}


const drawCanvas = regl({
  frag: glslify('./src/shader.frag'),
  vert: glslify('./src/shader.vert'),
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
    // src: regl.prop('src'),
    u_index: regl.prop('index'),
    u_zindex: regl.prop('z'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    u_circle_count: circleTotal,
    time: regl.context('time')
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
})


regl.frame(({ time }) => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })

  camera(() => {
    drawCanvas(circles.map((circle, index) => {
      circle.z -= .005;

      if (circle.z < 0) {
        circle.z = circleTotal;
      }

      return {
        index,
        z: circle.z,
        mousepos: [mouse().x, mouse().y],
        resolution: [dimensions.width, dimensions.height]
      };
    }));
  });
});


// function render () {
//   // ctx.clearRect(0, 0, dimensions.width, dimensions.height);
//   ctx.strokeStyle = '#fff';

//   // for (let i = 0; i < boxes.length; i++) {
//   //   boxes[i].update()
//   //   boxes[i].draw();
//   // }

//   requestAnimationFrame(render);
// }

// render();
