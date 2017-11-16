precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;

void main () {
  pos = 1.0 - 2.0 * texture2D(position, uv);

  pos *= 2.0;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}