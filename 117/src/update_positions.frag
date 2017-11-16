precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.x = uv.x / 4.0;
  _pos.y = uv.y / 4.0;
  _pos.z = mod(uv.x + uv.y + (time / 2.0), 1.0);

  gl_FragColor = vec4(_pos.xyz, 1);
}