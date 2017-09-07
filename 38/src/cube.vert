precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

varying vec3 _pos;
varying float n;
varying vec4 color;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  _pos = position + pos;

  n = snoise(vec3(_pos.xy, time));

  color = vec4((cos(n) + 1.0) / 2.0, (sin(n) + 1.0) / 2.0, (cos(n) + 1.0) / 2.0, 1.0);

  _pos.z = 1.0 - (dot(color.xyz, vec3(0.299, 0.587, 0.114)) * 50.0);

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
