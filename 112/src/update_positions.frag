precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float angle = 1.0 + 2.0 * (uv.x + uv.y) / .1;

  _pos.z = (sin(angle * uv.y) * cos(angle + (time)) + 1.0) / 2.0;
  _pos.y = (cos(angle * uv.x) * sin(angle + (time)) + 1.0) / 2.0;
  _pos.x = (uv.x + uv.y);

  gl_FragColor = vec4(_pos.xyz, 1);
}