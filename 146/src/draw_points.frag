precision highp float;

uniform float time;
varying vec3 _pos;
varying vec2 vUv;

void main () {
  gl_FragColor = vec4(vUv.x / 1.2, vUv.y / 1.2, (sin(time / 2.0) + 1.2), 1.0);
  // gl_FragColor = vec4(1, 1, 1, .6);
}