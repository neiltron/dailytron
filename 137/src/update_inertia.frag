precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float n_x = snoise(vec3(_pos.x));
  float n_y = snoise(vec3(_pos.y));
  float n_z = snoise(vec3(_pos.z));

  _pos.x += n_x * 100.0;
  _pos.y += n_y * 100.0;
  _pos.z += n_z * 100.0;

  // _pos = min(_pos, .01);

  gl_FragColor = vec4(_pos.xyz, 1);
}