import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';

let circleTotal = 10;
let circles = [];

document.body.appendChild(canvas);
let regl = new Regl(canvas);

for (let i = 0; i < circleTotal; i++)  {
  circles.push({
    index: i
  });
}

let circleBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

var image = new Image()
image.src = './cat.jpg';


image.onload = () => {
  var imageTexture = regl.texture(image);

  const drawCanvas = regl({
    frag: glslify('./src/shader.frag'),
    vert: glslify('./src/shader.vert'),
    count: 3,
    elements: null,
    depth: { enable: false },
    framebuffer: regl.prop('dest'),

    attributes: {
      position: [
        0, -4,
        4, 4,
        -4, 4
      ]
    },

    uniforms: {
      u_index: regl.prop('index'),
      u_color: regl.prop('color'),
      u_mousepos: regl.prop('mousepos'),
      u_resolution: regl.prop('resolution'),
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
      image: imageTexture,
      u_resolution: regl.prop('resolution'),
      time: regl.context('time')
    }
  })

  regl.frame(() => {
    circleBuffer.resize(1, 1);
    circleBuffer.resize(dimensions.width, dimensions.height);

    drawCanvas(circles.map((circle) => {
      return {
        dest: circleBuffer,
        index: circle.index,
        mousepos: [mouse().x, mouse().y],
        resolution: [dimensions.width, dimensions.height]
      };
    }));

    updatePixels({
      src: circleBuffer,
      resolution: [dimensions.width, dimensions.height]
    })
  });
}


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
