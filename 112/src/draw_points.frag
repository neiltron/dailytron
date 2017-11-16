precision highp float;

uniform float time;
varying vec3 pos;

void main () {
  vec3 color = vec3(0);

  color.x += (sin(pos.x) + 1.0) / 2.0;
  color.y += (sin(pos.y) + 1.0) / 2.0;
  color.z += (cos(pos.z) + 1.0) / 2.0;

  gl_FragColor = vec4(color, .1);
}