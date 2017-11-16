precision highp float;

varying vec4 pos;
varying vec2 vUv;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, pos.xy);

  _pos.x += _pos.z / 100.0;
  _pos.y += _pos.w / 100.0;

  _pos.x = mod(_pos.x, 10.0);
  _pos.y = mod(_pos.y, 10.0);

  gl_FragColor = vec4(_pos.xyzw);
}