precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.x = mod(uv.x / 4.0, .1);
  _pos.y = mod(uv.y, .1);
  _pos.z = mod(((uv.x + uv.y) / 10.0), .1);

  gl_FragColor = vec4(_pos.xyz, 1);
}