precision highp float;

uniform float time;
varying vec3 pos;

void main () {
  vec3 color = vec3(1);

  // color.x += (sin(pos.x) + 2.0) / 2.0;
  // color.y += (sin(pos.y) + 2.0) / 2.0;
  // color.z += (sin(pos.z) + 2.0) / 2.0;

  gl_FragColor = vec4(color, .5);
}