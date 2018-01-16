precision highp float;

uniform float time;
varying vec4 pos;
varying vec2 vUv;

void main () {
  gl_FragColor = vec4(vUv.xy, 1.0, .6);
  // gl_FragColor = vec4(1, 1, 1, .6);
}