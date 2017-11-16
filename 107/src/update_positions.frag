precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.z = (sin(time + (uv.x / .3) + uv.y) + 1.0) / 2.0;
  _pos.y = (cos(time + (uv.y / .3) + uv.x) + 1.0) / 2.0;
  _pos.x = uv.x;

  gl_FragColor = vec4(_pos.xyz, 1);
}