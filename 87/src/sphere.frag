precision highp float;

uniform float time;
uniform sampler2D src;
uniform float offset;
uniform vec2 u_resolution;
uniform bool lines;

varying vec2 vUv;
varying vec3 vNormal;

varying vec3 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  vec3 _pos = pos;

  // vec4 color = vec4(sin(time) * cos(time / 3.2) * sin(offset), sin(time) * cos(time / 2.45) * sin(offset), sin(time) * cos(time / 2.24) * sin(offset), 1.0);

  // color = mix(color, vec4(1), gl_FragCoord.y + gl_FragCoord.x / offset);

  // vec4 color = vec4(_pos.xy, sin(_pos.x) + cos(_pos.y), 1.0);

  // float n = snoise(vec3(gl_FragCoord.yz / 10.0, time));

  // color.a = n;

  // color.a = gl_FragCoord.z / offset;

  vec4 color = vec4(vNormal, .5) * vec4(.4);

  gl_FragColor = color;
}
