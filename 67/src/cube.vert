precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;
varying vec3 _pos;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main () {
  _pos = position + pos;
  // _pos.y -= time * 3.0;

  _pos.y = _pos.y - mod(time * 2.0, 6.0);

  float n = mod(snoise(vec3(_pos.xy, time / 10.0)), .4);
  // float n = sin(_pos.y);
  _pos.x += n * ((0.0 - _pos.y) / 20.0);


  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
