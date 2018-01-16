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

const RADIUS = 128;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  // theta: Math.PI * .5,
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

elements.push(8);
elements.push(4);
elements.push(5);

elements.push(4);
elements.push(5);
elements.push(0);

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

const drawLines = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  primitive: 'lines',
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
    drawTriangle({
      resolution: [dimensions.width, dimensions.height],
      tick,
      step,
      stepTime,
      z,
      turbulence,
    });

    // drawLines({
    //   lines: true,
    //   resolution: [dimensions.width, dimensions.height],
    //   tick,
    //   step,
    //   stepTime,
    //   z,
    //   turbulence,
    // });
  });
}


regl.frame(render);

let z = 1;
let turbulence = 10;


WebMidi.enable(function (err) {
  var input = WebMidi.inputs[0];

  console.log(input);

  input.addListener('noteon', "all",
    function (e) {
      console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
    }
  );

  // Listen to pitch bend message on channel 3
  input.addListener('pitchbend', 3,
    function (e) {
      console.log("Received 'pitchbend' message.", e);
    }
  );

  // Listen to control change message on all channels
  input.addListener('controlchange', "all",
    function (e) {
      console.log("Received 'controlchange' message.", e);

      if (e.controller.number == 32) {
        z = e.value;
      } else if (e.controller.number == 33) {
        turbulence = e.value;
      }
    }
  );
});