precision highp float;

uniform float time;
varying vec3 _pos;
varying vec2 vUv;

void main () {
  gl_FragColor = vec4(vUv.xy, 1.0, .2);
  // gl_FragColor = vec4(1, 1, 1, .6);
}