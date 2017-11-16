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

  dist = distance((position.x + .5) * u_resolution.x, u_mousepos.x);

  // float n_x = snoise(vec3(_pos.xy, offset + time)) / dist;
  // float n_y = snoise(vec3(_pos.xy, offset + time)) / dist;

  // _pos += vec2(n_x, n_y) * 10.0;

  gl_Position = projection * view * vec4(_pos.xy, (40.0 - offset) / 40.0 * ((cos(time * 2.0 + _pos.y * 2.0) + 1.0) / 2.0), 1) * vec4(1, -1, 1, 1);
}
