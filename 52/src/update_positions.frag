precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.x += ((mod(sin((time / 3.0) * uv.x), .8) * cos((time / 2.0) * uv.y)) / 100.0);
  _pos.y += ((mod(sin((time / 3.0) * uv.y), .8) * cos((time / 2.0) * uv.x)) / 100.0);

  gl_FragColor = vec4(_pos.xyz, 1);
}