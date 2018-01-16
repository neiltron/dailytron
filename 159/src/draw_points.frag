precision highp float;

uniform float time;
uniform vec2 u_resolution;
varying vec4 pos;
varying vec2 vUv;


void main () {
  gl_FragColor = vec4(cos(vUv.xy) / 4.0, cos(pos.x * pos.y / 100.0), (pos.y - pos.x) / 2.0);
}