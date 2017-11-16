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

const ITEMS = 200000;

let formatBufferData = (width, height, data) => {
  let t_canvas = document.createElement('canvas');
  t_canvas.width = width;
  t_canvas.height = height;
  let t_ctx = t_canvas.getContext('2d');

  const imageData = t_ctx.createImageData(width, height);

  imageData.data.set(data);
  t_ctx.putImageData(imageData, 0, 0);

  console.log(width, height)

  return t_ctx;
}

let rows = ITEMS / 4096;

let positionData = formatBufferData(Math.floor(ITEMS / rows), Math.ceil(rows), (new Float32Array(ITEMS * 4)).fill(1).map((p, i) => {
  if (i % 4 == 0) {
    return Math.floor((Math.random() + .01) * 255);
  } else if (i % 4 == 1) {
    return Math.floor((Math.random() + .01) * 255);
  } else if (i % 4 == 2) {
    return Math.floor((Math.random() + .01) * 255);
  } else {
    return Math.floor((Math.random() + .01) * 255);
  }
}));

let inertiaData = formatBufferData(Math.floor(ITEMS / rows), Math.ceil(rows), (new Float32Array(ITEMS * 4)).fill(.2));



const positionState = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture({
    data: positionData,
    type: 'float'
  })
}))

const inertiaState = new Array(2).fill(0).map(() => regl.framebuffer({
  depthStencil: false,
  colorFormat: 'rgba',
  color: regl.texture({
    data: inertiaData,
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

const sphereMesh = SphereMesh(.05, {
  subdivisions: 1
});

let textBuffer = regl.framebuffer({
  width: Math.floor(dimensions.width),
  height: Math.floor(dimensions.height)
})

document.body.appendChild(canvas);

const drawSphere = regl({
  frag: glslify('./src/sphere.frag'),
  vert: glslify('./src/sphere.vert'),
  elements: sphereMesh.cells,
  depth: { enable: false },
  // primitive: 'line loop',
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
    lines: false
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

const drawSphereLines = regl({
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
    lines: true
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
    inertiaSrc: regl.prop('inertiaSrc'),
    time: regl.context('time'),
  },

  attributes: {
    uv: particleLookup(ITEMS, 1),
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
})

const updateInertia = regl({
  vert: glslify('./src/update_inertia.vert'),
  frag: glslify('./src/update_inertia.frag'),

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

  // textBuffer.resize(1, 1);
  // textBuffer.resize(dimensions.width * 2, dimensions.height * 2);

  let spheres = [];

  for (let i = 0; i < ITEMS / 1000; i++) {
    spheres.push(
      {
        src: positionState[(tick + 1) % 2],
        dest: textBuffer,
        index: i
      }
    );
  }

  updateInertia({
    src: inertiaState[tick % 2],
    dest: inertiaState[(tick + 1) % 2]
  });

  updatePositions({
    src: positionState[tick % 2],
    inertiaSrc: inertiaState[tick % 2],
    dest: positionState[(tick + 1) % 2]
  });

  camera(() => {
    drawSphereLines(spheres);
    drawSphere(spheres);

    drawPoints({
      src: positionState[(tick + 1) % 2],
      dest: textBuffer
    });
  });

  // updatePixels({
  //   textSrc: textBuffer
  // });

}

regl.frame(render);