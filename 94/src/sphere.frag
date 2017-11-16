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



  vec4 color = vec4(vec3((sin(offset + time) + 1.0) / 2.0, (sin(offset + time / 1.2) + 1.0) / 2.0, (sin(offset + time / 1.5)) + 1.0) / 2.0, .5);

  gl_FragColor = color;
}
