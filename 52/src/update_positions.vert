precision highp float;

attribute vec2 xy;
uniform float time;
varying vec2 uv;
varying vec4 pos;

void main () {
  uv = 0.5 * xy + 0.5;
  pos = vec4(xy, xy);

  gl_Position = vec4(xy, 0, 1);
}