precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

void main () {
  vec3 _pos = position + pos;

  gl_Position = projection * view * vec4(_pos, 1);
}
