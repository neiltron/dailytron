precision highp float;

attribute vec3 position;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

varying vec3 _pos;

void main () {
  _pos = position + pos;

  _pos.y = _pos.y - mod(time * 70.0, 75.0);
  _pos.x += sin((_pos.y + time) / 20.0);

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
