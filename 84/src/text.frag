precision highp float;

uniform float time;
uniform sampler2D src;
uniform float offset;
uniform vec2 u_resolution;

varying vec2 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  // float n = snoise(vec3(_pos.x / 2.0, _pos.xy / 10.0 + (time / 3.0))) / 5.0;

  vec2 _pos = pos;

  vec4 color = vec4(sin(time) * cos(time / 3.2) * sin(offset), sin(time) * cos(time / 2.45) * sin(offset), sin(time) * cos(time / 2.24) * sin(offset), 1.0);

  color = mix(color, vec4(1), sin(gl_FragCoord.y + gl_FragCoord.x) / offset);

  gl_FragColor = color;
}
