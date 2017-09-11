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

  _pos.y = _pos.y - mod(time * 5.0, 6.0);

  // 2 * Math.PI * i / items
  float angle = (3.1416 / 180.0) * ((20.0 - _pos.x) * 30.0);
  _pos.z = sin(angle + time / 5.0);
  _pos.x = cos(angle + time / 5.0);

  float n = snoise(vec3(_pos.x / 2.0, _pos.yz / 10.0 + time));
  _pos.z += n / 20.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
