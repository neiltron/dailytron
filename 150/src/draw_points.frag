precision highp float;

uniform float time;
varying vec3 _pos;
varying vec2 vUv;

void main () {
  gl_FragColor = vec4(vUv.x / 2.8, vUv.y / 3., (sin(time * cos(time / 4.0) / 1.5) + 1.2) * 2.0, .1);
  // gl_FragColor = vec4(1, 1, 1, .2);
}