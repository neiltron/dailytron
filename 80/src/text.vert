precision highp float;

attribute vec2 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform float time;

varying vec2 pos;

void main () {
  pos = position;

  vec2 _pos = position;

  gl_Position = vec4(_pos.xy, 0, 1) * vec4(1, -1, 1, 1);
}
