precision highp float;

attribute vec2 xy;
varying vec4 pos;
varying vec2 vUv;
uniform float time;
uniform mat4 projection, view;
uniform vec2 u_resolution;


void main () {
  vUv = .5 * xy + .5;

  gl_Position = projection * view * vec4(xy, 0, 1);
}