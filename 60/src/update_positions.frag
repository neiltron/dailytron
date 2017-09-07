precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/4d');

void main () {
  vec4 _pos = texture2D(src, uv);

  // float nx = snoise(vec4(_pos.xyz * 2.0, time)) - .5;
  // float ny = snoise(vec4(_pos.yzx * 2.0, time)) - .5;
  // float nz = snoise(vec4(_pos.zxy * 2.0, time)) - .5;

  // _pos.x -= ((nx - 1.0) * 2.0) / 1000.0;
  // _pos.y -= ((ny - 1.0) * 2.0) / 1000.0;
  // _pos.z -= ((nz - 1.0) * 2.0) / 1000.0;

  // _pos = mod(_pos, 1.0);

  gl_FragColor = vec4(_pos.xyz, 1);
}