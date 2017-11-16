precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float _mod = .2;
  float _modPos = 1.0 - 2.0 * uv.x;

  _pos.x = (u_mousepos.x / u_resolution.x) + mod(_modPos, _mod) * (_mod / (uv.x / 2.0));
  _pos.y = (u_mousepos.y / u_resolution.y) + mod(_modPos, _mod) * (_mod / (uv.y / 2.0));

  _pos.z = 0.0;

  gl_FragColor = vec4(_pos.xyz, 1);
}