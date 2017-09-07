precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
varying vec2 pos;

void main() {

  float dist = distance(u_mousepos.xy, gl_FragCoord.xy / 2.0);
  float color = 1.0;

  if (dist < 100.0) {
    color = 0.0;
  }

  gl_FragColor = vec4(color, color, color, 1);
}
