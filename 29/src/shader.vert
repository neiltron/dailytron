precision mediump float;

attribute vec2 position;
varying vec2 pos;

void main () {
  pos = position;
  gl_Position = vec4(position.xy, 0, 1.0);
}
