precision highp float;

uniform float time;
varying vec3 _pos;
varying vec4 color;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {
  vec4 _color = vec4(0);

  float n = snoise(vec3(_pos.xy / 100.0, time / 10.0));
  // color = vec4((sin(n) + 1.0) / 2.0, (sin(n) + 1.0) / 4.0, (sin(n) + 1.0) / 2.0, 1.0);

  _color.r += ((sin(smoothstep(n, .1, .3) ) + 1.0) / 2.0) * (n * 1.5);
  _color.g += ((sin(smoothstep(n, .2, .4) ) + 1.0) / 2.0) * (n * 1.5);
  _color.b += ((sin(smoothstep(n, .3, .5) ) + 1.0) / 2.0) * (n * 1.5);
  _color.rg += ((sin(smoothstep(n, .6, .8)) + 1.0) / 2.0) * (n * 1.5);
  _color.gb += ((sin(smoothstep(n, .7, 1.0)) + 1.0) / 2.0) * (n * 1.5);
  _color.rb += ((sin(smoothstep(n, .8, 1.0)) + 1.0) / 2.0) * (n * 1.5);

  gl_FragColor = _color;
}
