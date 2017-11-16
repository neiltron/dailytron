precision mediump float;

attribute vec2 position;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
varying vec2 pos;

void main () {
  pos = position;

  gl_Position = vec4(1.0 - 2.0 * pos.xy, 0, 1.0) * vec4(-1.0, 1.0, 1.0, 1.0);
}
