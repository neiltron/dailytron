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

void main () {
  vUv = uv;
  vNormal = normal;
  pos = position;

  vec3 _pos = position * offset;

  dist = distance((position.x + .5) * u_resolution.x, u_mousepos.x);

  float n_x = snoise(vec3(_pos.xy * (offset * 2.0), time / 2.0)) / 10.0;
  float n_y = snoise(vec3(_pos.yx * (offset * 2.0), time / 2.0)) / 10.0;
  float n_z = snoise(vec3(_pos.yz * (offset * 2.0), time / 2.0)) / 10.0;

  // _pos += vec2(n_x, n_y) * 10.0;

  float z = (40.0 - offset) / 40.0 * ((cos(time * 2.0 + _pos.y * 2.0) + 1.0) / 2.0);

  gl_Position = projection * view * vec4(_pos.x + n_x, _pos.y + n_y, _pos.z + n_z, 1) * vec4(1, -1, 1, 1);
}
