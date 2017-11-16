precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  float angle = ((uv.x + uv.y)) / .1;

  _pos.z = (sin((time / 50.0) * (angle * uv.y)) * cos(angle) + 1.0) / 2.0;
  _pos.y = (cos((time / 50.0) * (angle * uv.x)) * sin(angle) + 1.0) / 2.0;
  _pos.x = (1.0 + 2.0 * (sin(uv.x + mod(time / 5.0, 10.0)) + cos(uv.y + mod(time / 5.0, 10.0))));

  gl_FragColor = vec4(_pos.xyz, 1);
}