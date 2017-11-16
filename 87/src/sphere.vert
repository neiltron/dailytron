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
varying float dist_x;
varying float dist_y;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vUv = uv;
  vNormal = normal;

  vec3 _pos = position;

  _pos *= 1.0 + sin(time / 2.0) / 10.0;

  dist_x = distance(position.x * u_resolution.x, (sin(time / 10.0)) * u_resolution.x / 2.0);
  dist_y = distance(position.y * u_resolution.y, (cos(time / 10.0)) * u_resolution.y / 2.0);

  float n_x = ((snoise(vec3(_pos.xy * (offset * 2.0), time)) / dist_x) + 1.0) / 50.0;
  float n_y = ((snoise(vec3(_pos.yx * (offset * 2.0), time)) / dist_y) + 1.0) / 50.0;
  float n_z = ((snoise(vec3(_pos.yz * (offset * 2.0), time)) / ((dist_y + dist_x) / 2.0)) + 1.0) / 50.0;

  pos = _pos;

  float z = (40.0 - offset) / 40.0 * ((cos(time * 2.0 + _pos.y * 2.0) + 1.0) / 2.0);

  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4(_pos.x + n_x, _pos.y + n_y, _pos.z + n_z, 1) * vec4(1, -1, 1, 1);
}
