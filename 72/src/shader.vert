precision mediump float;

attribute vec2 position;
uniform float u_index;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
varying vec2 pos;

void main () {
  pos = position;
  vec2 mouseOffset = (u_resolution.xy / 2.0) - u_mousepos.xy / u_index;
  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);

  gl_Position = vec4(1.0 - 2.0 * pos.xy, 0, 1.0) * vec4(-1.0, 1.0, 1.0, 1.0);
}
