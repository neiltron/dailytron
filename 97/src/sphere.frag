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

  vec4 color = vec4(1, 1, 1, .003);

  gl_FragColor = color;
}
