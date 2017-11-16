precision highp float;

uniform float time;
uniform sampler2D src;
uniform float offset;
uniform vec2 u_resolution;

varying vec2 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  vec2 _pos = pos;

  vec4 color = vec4(sin(time) * cos(time / 3.2) * sin(offset), sin(time) * cos(time / 2.45) * sin(offset), sin(time) * cos(time / 2.24) * sin(offset), 1.0);

  color = mix(color, vec4(1), gl_FragCoord.y + gl_FragCoord.x / offset);

  // float n = snoise(vec3(gl_FragCoord.yz / 10.0, time));

  // color.a = n;

  color.a = gl_FragCoord.z / offset;

  gl_FragColor = color;
}
