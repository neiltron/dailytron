precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  // _pos.x += ((sin(time) * cos(time)) / 100.0);
  // _pos.y += ((sin(time) * cos(time)) / 100.0);
  // _pos.z += sin(time / 100.0) / 5.3;

  gl_FragColor = vec4(_pos.xyz, 1);
}