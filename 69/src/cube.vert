precision highp float;

attribute vec2 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main () {
  float n = snoise(vec3(position.x / 2.0, position.xy / 10.0 + (time / 3.0))) / 5.0;

  mat4 _projection = projection + mat4(
    vec4(0, sin(time), 1.0, 1.0),
    vec4(cos(time), cos(time), 1.0, 1.0),
    vec4(0),
    vec4(0)
  );

  gl_Position = _projection * view * vec4(position.xy + n, n, 1) * vec4(1, -1, 1, 1);
}
