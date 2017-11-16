import { vec2, mat4 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import Camera from './src/camera';
import SphereMesh from 'primitive-icosphere';
import triangulate from 'delaunay-triangulate';

let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float']
});

const ITEMS = 2000;

let t_canvas = document.createElement('canvas');
t_canvas.width = ITEMS;
t_canvas.height = 1;
let t_ctx = t_canvas.getContext('2d');

const imageData = t_ctx.createImageData(ITEMS, 1);
const TEXTURE_DATA = (new Float32Array(ITEMS * 4)).fill(1).map((p, i) => {
  if (i % 4 == 0) {
    return Math.floor((Math.random()) * 255);
  } else if (i % 4 == 1) {
    return Math.floor((Math.random()) * 255);
  } else if (i % 4 == 2) {
    return Math.floor((Math.random()) * 255);
  } else {
    return Math.floor((Math.random()) * 255);
  }
});

console.log(TEXTURE_DATA)

imageData.data.set(TEXTURE_DATA);
t_ctx.putImageData(imageData, 0, 0);

const state = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture({
    data: t_ctx,
    type: 'float'
  })
}))

function particleLookup (w, h) {
  return new Array(w * h).fill(0).map((d, i) => [
    (i % w) / Math.max(1, w - 1),
    Math.floor(i / w) / (h - 1)
  ]);
}


const camera = Camera(regl);

const sphereMesh = SphereMesh(.1, {
  subdivisions: 1
});

let textBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

document.body.appendChild(canvas);

const drawSpherePoints = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  elements: sphereMesh.cells,
  depth: { enable: false },
  primitive: 'line loop',
  // count: positions.length,

  // framebuffer: regl.prop('dest'),

  attributes: {
    position: sphereMesh.positions,
    uv: sphereMesh.uvs,
    normal: sphereMesh.normals,
  },

  uniforms: {
    time: regl.context('time'),
    src: regl.prop('src'),
    index: regl.prop('index'),
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

const drawPoints = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'points',
  count: ITEMS,
  depth: {enable: false},
  // framebuffer: regl.prop('dest'),

  uniforms: {
    position: regl.prop('src'),
    time: regl.context('time')
  },

  attributes: {
    uv: particleLookup(ITEMS, 1)
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

const updatePositions = regl({
  vert: glslify('./src/update_positions.vert'),
  frag: glslify('./src/update_positions.frag'),

  framebuffer: regl.prop('dest'),
  count: 3,
  depth: { enable: false },

  uniforms: {
    src: regl.prop('src'),
    time: regl.context('time'),
  },

  attributes: {
    uv: particleLookup(ITEMS, 1),
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
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
    textSrc: regl.prop('textSrc'),
    u_mousepos: regl.prop('mousepos'),
    u_resolution: regl.prop('resolution'),
    time: regl.context('time')
  }
})

let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  textBuffer.resize(1, 1);
  textBuffer.resize(dimensions.width * 2, dimensions.height * 2);

  let spheres = [];

  for (let i = 0; i < ITEMS; i++) {
    spheres.push(
      {
        src: state[(tick + 1) % 2],
        dest: textBuffer,
        index: i
      }
    );
  }

  updatePositions({
    src: state[tick % 2],
    dest: state[(tick + 1) % 2]
  });

  camera(() => {
    drawSpherePoints(spheres);

    drawPoints({
      src: state[(tick + 1) % 2],
      dest: textBuffer
    });
  });

  // updatePixels({
  //   textSrc: textBuffer
  // });

}

regl.frame(render);