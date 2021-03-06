import { vec2 } from 'gl-matrix';
import Regl from 'regl';
import glslify from 'glslify';
import zeros from 'zeros';
import dimensions from './src/dimensions';
import { ctx, canvas } from './src/canvas';
import mouse from './src/mousemove';
import 'whatwg-fetch';
import getWebcam from './src/webcam';


let regl = new Regl({
  canvas: canvas,
  extensions: ['OES_texture_float', 'OES_texture_half_float']
});

document.body.appendChild(canvas);

const TEXTURE_WIDTH = 800;
const TEXTURE_HEIGHT = 600;
let horse;

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 0,
  theta: Math.PI * 1.2,
  phi: 0,
  mouse: true,
  damping: .00001,
  rotationSpeed: .25
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

const drawTriangles = regl({
  vert: glslify('./src/draw_triangles.vert'),
  frag: glslify('./src/draw_triangles.frag'),

  primitive: 'triangles',
  count: regl.prop('elements'),
  depth: {enable: false},

  uniforms: {
    position: regl.prop('src'),
    time: regl.context('time'),
    u_resolution: regl.prop('resolution'),
    u_reflection: regl.prop('reflection')
  },

  attributes: {
    xyz: regl.prop('positions'),
    normal: regl.prop('normals'),
    uv: particleLookup(TEXTURE_WIDTH, TEXTURE_HEIGHT)
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

let render = function ({ tick }) {
  // regl.clear({
  //   color: [0, 0, 0, 1],
  //   depth: 1,
  //   stencil: 0
  // })

  camera(() => {
    drawTriangles({
      resolution: [dimensions.width, dimensions.height],
      reflection: img,
      positions: horse.positions,
      normals: horse.normals,
      elements: horse.positions.length
    });
  });
}

function unindex (obj) {
  var complex = {
    positions: [],
    uvs: [],
    normals: []
  };

  for (let i = 0; i < obj.facePositions.length; i++) {
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][0]]);
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][1]]);
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][2]]);
  }
  /*for (i = 0; i < obj.faceUVs.length; i++) {
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][0]]);
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][1]]);
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][2]]);
  }*/
  for (let i = 0; i < obj.faceNormals.length; i++) {
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][0]]);
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][1]]);
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][2]]);
  }

  return complex;
}


let img, video;

getWebcam({
  regl,
  done: (resp) => {
    console.log(resp);

    img = resp.webcam;
    video = resp.video;

    video.style.width = dimensions.width > dimensions.height ? '100%' : 'auto';
    video.style.height = dimensions.width > dimensions.height ? 'auto' : '100%';


    loadModelAndRender();
  },
  error: () => {
    img = document.createElement('img');
    img.onload = () => {
      img = regl.texture(img);

      loadModelAndRender();
    }
    img.src = './reflection.png';
  }
});

// should split this into two steps buuuut whatever
const loadModelAndRender = () => {
  fetch('./model.json')
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      horse = unindex(body);

      regl.frame(render);
    });
};
