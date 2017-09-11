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

  _pos.y = _pos.y - mod(time * 3.0, 6.0);

  // float n = snoise(vec3(_pos.xyz));
  // _pos.z += n / 10.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
