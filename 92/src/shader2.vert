precision highp float;

attribute vec2 position;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
uniform float time;
uniform sampler2D mouseSrc;
varying vec2 pos;

void main () {
  pos = position;

  // pos.y -= .5;

  gl_Position = vec4(position * 2.0, 0, 1);
}
