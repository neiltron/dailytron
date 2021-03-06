precision highp float;

uniform float time;
varying vec4 pos;

void main () {
  vec3 color = vec3(0);

  color.x += (sin(pos.x / 10.0) + 1.0) / 2.0;
  color.y += (sin(pos.y / 10.0) + 1.0) / 2.0;
  color.z += (sin(pos.x / 10.0) + 1.0) / 2.0;

  gl_FragColor = vec4(color, .1);
  // gl_FragColor = vec4(1.0);
}