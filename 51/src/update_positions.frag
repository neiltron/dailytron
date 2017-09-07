precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.x += ((sin((time / 3.0) * uv.x) * cos((time / 2.0) * uv.y)) / 100.0);
  _pos.y += ((sin((time / 3.0) * uv.y) * cos((time / 2.0) * uv.x)) / 100.0);

  gl_FragColor = vec4(_pos.xyz, 1);
}