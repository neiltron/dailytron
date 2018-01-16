precision highp float;

uniform float time;
uniform vec2 u_resolution;
varying vec4 pos;
varying vec2 vUv;


void main () {
  // float alpha = (pos.y - pos.x) / 2.0;
  float alpha = 1.0;

  gl_FragColor = vec4((cos(vUv.xy) + 1.0) / 4.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}