precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  pos = texture2D(position, uv);

  float n_x = snoise(vec3(pos.x, uv.x, time / 2.0)) / 1.0;
  float n_y = snoise(vec3(pos.y, uv.y, time / 2.0)) / 1.0;
  float n_z = snoise(vec3(pos.z, (uv.x + uv.y) / 2.0, time / 2.0)) / 1.0;

  pos.xyz *= 40.0;
  pos.y -= 2.0;
  pos.z -= 2.0;
  pos.x -= 2.0;

  pos.xyz /= vec3(n_x, n_y, n_z);

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 2.0;
}