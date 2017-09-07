precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

varying vec3 _pos;
varying float n;
varying vec4 color;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  _pos = position + pos;

  n = snoise(vec3(_pos.xy / 50.0, time / 2.0));

  float offset = mod(_pos.x / 20.0, (abs(sin(time / 10.0)) + .5) / (u_resolution.x / 200.0));

  color = vec4((sin(n) + 1.0) / 2.0, (sin(n) + 1.0) / 4.0, (sin(n) + 1.0) / 2.0, 1.0);

  _pos.z += offset * 20.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
