precision highp float;

uniform float time;
varying vec4 pos;
varying vec2 vUv;

void main () {
  vec4 color = vec4(1.0, vUv.xy + vec2(.5, 0), .3);

  gl_FragColor = vec4(color);
}