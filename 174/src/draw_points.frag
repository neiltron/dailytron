precision highp float;

uniform float time;
uniform bool u_lines;
uniform vec2 u_resolution;
varying vec4 pos;
varying vec3 vUv;


void main () {
  // float alpha = (pos.y - pos.x) / 2.0;
  float alpha = 1.0;
  float z = (pos.z * 100.0) * -.09;
  float blue = (sin(z / 5.0 * mod(z, 1.) + (time / 10.0)) + 1.0) / 2.0;

  gl_FragColor = u_lines ? vec4(1, 1, 1, .5) : vec4((sin(pos.x * 1.8) + 1.0) / 2.0, (cos(pos.y * 1.8) + 1.0) / 2.0, blue, .8);

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}