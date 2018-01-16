import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import WebMidi from 'webmidi';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 40;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  theta: Math.PI,
  // phi: Math.PI * -.3,
  mouse: true,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

function particleLookup (width, height) {
  return new Array(width * height).fill(0).map((d, i) => {
    const row = i % width;
    const column = Math.floor(i / width);

    return [
      row / Math.max(1, width - 1),
      column / (height - 1)
    ];
  });
}


const initialTriangle = [
  [0, 0, 0],
  [4, 0, 0],
  [4, 4, 0],
  [0, 4, 0],
];

let positions = [];
let elements = [];

const columns = RADIUS * 1.69;
const rows = RADIUS;

for (let column = 0; column < columns; column++) {
  for (let row = 0; row < rows; row++) {
    positions.push([initialTriangle[0][0], initialTriangle[0][1], column * 4.0]);
    positions.push([initialTriangle[1][0], initialTriangle[1][1], column * 4.0]);
    positions.push([initialTriangle[2][0], initialTriangle[2][1], column * 4.0]);
    positions.push([initialTriangle[3][0], initialTriangle[3][1], column * 4.0]);

    if (column > 0 && row <= 1) {
      const index = column * (rows) + row;

      elements.push(index);
      elements.push(index - 3);
      elements.push(index - 4);

      elements.push(index);
      elements.push(index - 3);
      elements.push(index + 1);
    }

    if (column > 0 && row >= 2) {
      const index = column * (rows) + row;

      elements.push(index);
      elements.push(index - 5);
      elements.push(index - 4);

      elements.push(index);
      elements.push(index - 5);
      elements.push(index - 1);
    }
  }
}

console.log(positions.length, elements, elements.length);



const drawTriangle = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  // primitive: 'triangle',
  // count: elements.length,
  elements: elements,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: false,
    u_step: regl.prop('step'),
    u_stepTime: regl.prop('stepTime'),
    u_z: regl.prop('z'),
    u_turbulence: regl.prop('turbulence'),
    u_offset: regl.prop('offset'),
    u_transformX: regl.prop('transformX'),
    u_transformY: regl.prop('transformY'),
    u_transformZ: regl.prop('transformZ'),
  },

  attributes: {
    xy: [
      positions
    ]
  },

  blend: {
    enable: false,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 1,
      dstAlpha: 1
    },
    equation: { rgb: 'add', alpha: 'add' }
  },
});

const drawLines = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'points',
  // count: positions.length,
  elements: elements,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: true,
    u_step: regl.prop('step'),
    u_stepTime: regl.prop('stepTime'),
    u_z: regl.prop('z'),
    u_turbulence: regl.prop('turbulence'),
    u_offset: regl.prop('offset'),
    u_transformX: regl.prop('transformX'),
    u_transformY: regl.prop('transformY'),
    u_transformZ: regl.prop('transformZ'),
  },

  attributes: {
    xy: [
      positions
    ]
  },

  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 1,
      dstAlpha: 1
    },
    equation: { rgb: 'add', alpha: 'add' }
  },
});

let step = 0;
let stepTime = 0;

let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })


  if (tick % 200 == 0) {
    step = tick / 200;
    stepTime = tick;
  }


  camera(() => {

    for (let i = 0; i < 20; i++) {
      drawTriangle({
        resolution: [dimensions.width, dimensions.height],
        tick,
        step,
        stepTime,
        z,
        turbulence,
        transformX: transforms.x,
        transformY: transforms.y,
        transformZ: transforms.z,
        offset: i
      });

      // drawLines({
      //   lines: true,
      //   resolution: [dimensions.width, dimensions.height],
      //   tick,
      //   step,
      //   stepTime,
      //   z,
      //   turbulence,
      //   transformX: transforms.x,
      //   transformY: transforms.y,
      //   transformZ: transforms.z,
      //   offset: i
      // });
    }
  });
}


regl.frame(render);

let z = 1;
let turbulence = 50;
let transforms = {
  x: false,
  y: true,
  z: true
}


WebMidi.enable(function (err) {
  var input = WebMidi.inputs[0];

  input.addListener('noteon', "all",
    function (e) {
      if (e.note.number == 50) {
        transforms.x = !transforms.x;
      } else if (e.note.number == 45) {
        transforms.y = !transforms.y;
      } else if (e.note.number == 51) {
        transforms.z = !transforms.z;
      }
    }
  );

  input.addListener('controlchange', "all",
    function (e) {
      if (e.controller.number == 32) {
        z = e.value + 1;
      } else if (e.controller.number == 33) {
        turbulence = e.value + 1;
      }
    }
  );
});