precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
uniform float offset;

attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/classic/3d');
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  vUv = uv;
  vNormal = normal;

  vec3 _pos = position;

  _pos *= rotateY(time * 10.0 * DEG_TO_RAD);
  _pos *= rotateX(offset * time * DEG_TO_RAD);


  pos = _pos;

  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4(_pos.x, _pos.y, _pos.z, 1) * vec4(1, -1, 1, 1);
}
