precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

#pragma glslify: snoise = require('glsl-noise/classic/2d');

void main () {
  pos = 1.0 - 2.0 * texture2D(position, uv);

  pos.x *= 8.0;
  pos.y *= 4.6;

  float n_x = snoise(vec2(pos.xy + uv.xy + time / 4.0));
  float n_y = snoise(vec2(pos.yx + uv.yx + time / 4.0));

  pos.xy *= vec2(n_x, n_y);

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 2.0;
}