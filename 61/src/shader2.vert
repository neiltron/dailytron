precision highp float;

attribute vec2 position;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
uniform float time;
uniform sampler2D mouseSrc;
varying vec2 vUv;

void main () {
  vUv = position;

  gl_Position = vec4(position, 0, 1);
}
