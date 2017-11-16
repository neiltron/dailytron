precision highp float;

uniform float time;
uniform sampler2D src;
uniform float offset;
uniform vec3 color;

varying vec2 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  // float n = snoise(vec3(_pos.x / 2.0, _pos.xy / 10.0 + (time / 3.0))) / 5.0;

  vec2 _pos = pos;

  vec4 _color = vec4(sin(time) * cos(time / 2.2), cos(time) * sin(time * 1.45), cos(time) * sin(time / 1.24), .1);

  gl_FragColor = _color;
}
