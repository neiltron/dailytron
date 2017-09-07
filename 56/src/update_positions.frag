precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float angle = (3.14 * 2.0) / uv.x;

  _pos.x = (sin(angle)) * 10000.0;
  _pos.y = (cos(angle)) * 10000.0;
  _pos.z = sin(time / uv.x) / cos(time / uv.y);

  gl_FragColor = vec4(_pos.xyz, 1);
}