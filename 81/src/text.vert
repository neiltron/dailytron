precision highp float;

attribute vec2 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
uniform float offset;

varying vec2 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  pos = position;

  vec2 _pos = position;

  dist = distance(vec2(position + .5) * u_resolution, u_mousepos);

  float n = snoise(vec3(_pos, (u_mousepos / u_resolution) * offset + time)) / dist;
  _pos += n * 10.0;

  gl_Position = vec4(_pos.xy, 0, 1) * vec4(1, -1, 1, 1);
}
