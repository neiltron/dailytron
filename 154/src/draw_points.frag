precision highp float;

uniform float time;
uniform sampler2D sphereSrc;
varying vec2 center;
varying vec4 pos;
varying vec2 vUv;
varying float centerHeight;

void main () {
  float opacity = 1.0 - distance(center, vUv);

  vec4 color = vec4(sin(vUv.x), cos(vUv.x), .5, opacity);

  gl_FragColor = color;
}