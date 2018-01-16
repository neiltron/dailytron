precision highp float;

attribute vec2 xy;
varying vec4 pos;
varying vec2 vUv;
uniform float time;
uniform mat4 projection, view;
uniform vec2 u_resolution;


void main () {
  vUv = xy;

  gl_Position = vec4(xy, 0, 1);
}