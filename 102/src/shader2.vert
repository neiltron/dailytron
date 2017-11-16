precision highp float;

attribute vec2 position;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
uniform float time;
uniform sampler2D mouseSrc;
varying vec2 pos;

void main () {
  pos = position;

  // pos.x -= .5;
  // pos.y -= 1.0;

  gl_Position = vec4(pos, 0, 1);
}
