precision highp float;

uniform float time;
varying vec3 pos;

void main () {
  vec3 color = vec3(0);

  color.x += (sin(pos.x + (time / 5.0)) + .725) / 2.0;
  color.y += (sin(pos.y + (time / 5.0)) + .725) / 2.0;
  color.z += (sin(pos.z + (time / 5.0)) + .725) / 2.0;

  gl_FragColor = vec4(color, .6);
}