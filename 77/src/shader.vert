precision mediump float;

attribute vec2 position;
uniform float time;
uniform float u_index;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
varying vec2 pos;

void main () {
  pos = position;
  vec2 mouseOffset = (u_resolution.xy / 2.0) - u_mousepos.xy / u_index;
  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);

  // pos.x = 1.0 - 2.0 * pos.x - u_index * .01 * sin(time);
  // pos.y = 1.0 - 2.0 * pos.y - u_index * .01 * cos(time);

  vec2 _pos;

  _pos.x = 1.0 - 2.0 * pos.x - (u_index * .01 * sin(time) / 3.0);
  _pos.y = 1.0 - 2.0 * pos.y - (u_index * .01 * cos(time) / 3.0);

  gl_Position = vec4(_pos.xy, 0, 1.0) * vec4(-1.0, 1.0, 1.0, 1.0);
}
