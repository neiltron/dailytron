precision highp float;
#define GLSLIFY 1

attribute vec2 uv;
varying vec4 _pos;
varying vec2 vUv;
uniform float time;
uniform sampler2D position;

void main () {
  vUv = uv;

  gl_Position = vec4(2.0 * vUv - 1.0, .5, 1.0);
}