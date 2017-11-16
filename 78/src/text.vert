precision highp float;

attribute vec2 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform float time;

varying vec2 pos;

void main () {
  pos = position;

  vec2 _pos = position;
  _pos.y -= .1;

  // mat4 _projection = projection + mat4(
  //   vec4(0, sin(time), 1.0, 1.0),
  //   vec4(cos(time), cos(time), 1.0, 1.0),
  //   vec4(0),
  //   vec4(0)
  // );

  gl_Position = vec4(_pos.xy, 1, 1) * vec4(1, -1, 1, 1);
}
