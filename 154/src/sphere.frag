precision highp float;

uniform float time;
uniform float offset;
uniform vec2 u_resolution;
uniform bool lines;

varying vec3 v_pos;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  vec4 color = vec4(
    (sin(time / 1.0 + mod(v_pos.x, 10.0) * 2.0) + 1.0) / 2.0,
    (sin(time / 1.0 + mod(v_pos.y, 10.0) * 2.0) + 1.0) / 2.0,
    (sin(time / 1.0 + mod(v_pos.z, 10.0) * 2.0) + 1.0) / 2.0,
    .1
  );

  gl_FragColor = color;
}
