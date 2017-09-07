precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

varying vec3 _pos;
varying float n;
varying vec4 color;


void main () {
  _pos = position + pos;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
