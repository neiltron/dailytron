precision highp float;

uniform float time;
uniform sampler2D src;
uniform float offset;
uniform vec2 u_resolution;
uniform bool lines;

varying vec3 pos;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  vec3 _pos = pos;

  vec4 color = lines ? vec4((sin(pos * 10.0 * time) + 1.0) / 2.0, 1) : vec4(0, 0, 0, 1);

  gl_FragColor = color;
}
