precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float n_x = snoise(vec3(_pos.x * u_resolution.x)) - .5;
  float n_y = snoise(vec3(_pos.y * u_resolution.y)) - .5;

  _pos.x += (n_x) / 1000.0;
  _pos.y += (n_y) / 1000.0;
  _pos.z += ((n_x + n_y) / 2.0) / 10.0;

  // _pos = min(_pos, .01);

  gl_FragColor = vec4(_pos.xyz, 1);
}