precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
uniform float offset;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/classic/3d');
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY);
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX);
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)

const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  vec3 _pos = position;

  // _pos *= (mod(offset, 2.0) + 1.0) * 3.0;


  // _pos *= rotateY(time * 5.0 * DEG_TO_RAD);
  // _pos *= rotateZ((offset / 2.0) * (time / 2.0) * DEG_TO_RAD);

  // _pos *= 1.0 + (offset * .000001);

  // _pos.x -= (offset / 100.0);

  _pos /= 2.0;

  _pos.x += sin(time * mod(position.x, .6)) + cos((time * mod(position.x, .5)) / 1.4);
  _pos.y += cos(time * mod(position.y, .6)) + sin((time * mod(position.y, .5)) / 1.2);

  pos = _pos;

  gl_PointSize = 4.0;
  gl_Position = projection * view * vec4(_pos.xyz, 1) * vec4(1, -1, 1, 1);
}
