precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/4d');

void main () {
  vec4 _pos = texture2D(src, uv);

  gl_FragColor = vec4(_pos.xyz, 1);
}