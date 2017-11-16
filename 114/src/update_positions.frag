precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float angle = 1.0 + 2.0 * (uv.x + uv.y) / .1;

  _pos.z = (uv.x / 4.0 + uv.y / 2.0) * 3.0;
  _pos.x = ((sin(angle + uv.y) * cos(angle + (time)) + 1.0) / 2.0) / _pos.z;
  _pos.y = (cos(angle + uv.x / 2.0) * sin(angle + (time / 4.0)) + 1.0) / 2.0;

  // _pos.x = sin(uv.x * 4.0) * cos(uv.y * 4.0);
  // _pos.y = sin(uv.y * 4.0) * cos(uv.x * 4.0);

  // _pos.xy = uv.xy * 2.0;

  // _pos.z = (uv.x + uv.y);

  gl_FragColor = vec4(_pos.xyz, 1);
}