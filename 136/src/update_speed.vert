precision highp float;

attribute vec2 xy;
uniform float time;
varying vec2 uv;

void main () {
  uv = .5 * xy + .5;

  gl_Position = vec4(xy, 0, 1);
}