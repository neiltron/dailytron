precision highp float;

attribute vec2 position;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
varying vec2 pos;

void main () {
  pos = position;

  vec2 _pos = pos.xy;

  _pos.x += (u_mousepos.x / u_resolution.x) / (u_resolution.x / 4.0);

  gl_Position = vec4(1.0 - 2.0 * _pos.xy, 0, 1.0) * vec4(-1.0, 1.0, 1.0, 1.0);
}
