precision highp float;

varying vec2 center;
varying vec4 pos;
varying vec2 vUv;
varying float centerHeight;

void main () {
  gl_FragColor = vec4(1, 1.0 - distance(center, vUv) * 10.0, pos.z, 1);
}