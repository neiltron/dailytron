import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const RADIUS = 15;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 40,
  theta: Math.PI * .5,
  // phi: Math.PI * -.1,
  mouse: false,
  damping: .00001,
  rotationSpeed: .25,
  far: 10000
});

let amplitude = 0;
let scrollPos = 0;

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
  [0, 0],
  [4, 0],
  [0, 4],
  [4, 0],
  [0, 4],
  [4, 4],

];
let lastTriangle = initialTriangle;

let xy = [];

for (let column = 0; column < RADIUS * 1.69; column++) {
  for (let row = 0; row < RADIUS; row++) {
    const referenceTriangle = row === 0 ? initialTriangle : lastTriangle;

    const newTriangle = [
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[0][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[1][1] + 4],
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[2][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[3][1] + 4],
      [initialTriangle[0][0] + (column * 4),  referenceTriangle[4][1] + 4],
      [initialTriangle[1][0] + (column * 4),  referenceTriangle[5][1] + 4],
    ];

    xy.push(newTriangle[0]);
    xy.push(newTriangle[1]);
    xy.push(newTriangle[2]);
    xy.push(newTriangle[3]);
    xy.push(newTriangle[4]);
    xy.push(newTriangle[5]);

    lastTriangle = newTriangle;
  }
}

const drawTriangle = regl({
  vert: glslify('./src/draw_points.vert'),
  frag: glslify('./src/draw_points.frag'),

  // primitive: 'triangle',
  count: xy.length,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: false,
    u_texture: regl.prop('img'),
    u_scroll_pos: regl.prop('scrollPos'),
    u_amplitude: regl.prop('amplitude'),
    u_pixel_ratio: regl.prop('pixelRatio'),
  },

  attributes: {
    xy: [
      xy
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

  primitive: 'lines',
  count: xy.length,
  depth: { enable: false },

  uniforms: {
    time: regl.prop('tick'),
    u_resolution: regl.prop('resolution'),
    u_lines: true,
    u_texture: regl.prop('img'),
    u_scroll_pos: regl.prop('scrollPos'),
    u_amplitude: regl.prop('amplitude'),
    u_pixel_ratio: regl.prop('pixelRatio'),
  },

  attributes: {
    xy: [
      xy
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


let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  // if (amplitude > .1) {
  //   amplitude -= .05;
  // } else if (amplitude < -.1) {
  //   amplitude += .05;
  // }

  camera(() => {
    drawTriangle({
      resolution: [dimensions.width, dimensions.height],
      tick: tick,
      img,
      scrollPos,
      amplitude,
      pixelRatio: window.devicePixelRatio,
    });

    drawLines({
      lines: true,
      resolution: [dimensions.width, dimensions.height],
      tick: tick,
      img,
      scrollPos,
      amplitude,
      pixelRatio: window.devicePixelRatio,
    });
  });
}

document.addEventListener('wheel', (e) => {
  amplitude += e.deltaY / 500;
});

var content = document.getElementById('content');

var data = `<svg xmlns="http://www.w3.org/2000/svg" width="${content.clientWidth}" height="${content.clientHeight}">` +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
             content.innerHTML +
           '</div>' +
           '</foreignObject>' +
           '</svg>';

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([data], {type: 'image/svg+xml'});
// var url = DOMURL.createObjectURL(svg);

var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(data);

console.log(url);

img.onload = function() {
  // DOMURL.revokeObjectURL(url);

  console.log(img);

  img = regl.texture(img);

  regl.frame(render);
}
img.crossOrigin = '';
img.src = url;