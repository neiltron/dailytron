precision highp float;

uniform float time;
uniform bool u_lines;
uniform vec2 u_resolution;
varying vec4 pos;
varying vec2 vUv;


void main () {
  // float alpha = (pos.y - pos.x) / 2.0;
  float alpha = 1.0;
  float blue = (sin(pos.z / 5.0 * mod(pos.z, 1.) + (time / 100.0)) + 1.0) / 2.0;

  gl_FragColor = u_lines ? vec4(1, 1, 1, 1.0) : vec4((sin(pos.x * 1.5) + 1.0) / 2.0, (cos(pos.y * 1.5) + 1.0) / 2.0, blue, .1);

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}