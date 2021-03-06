precision highp float;

uniform float time;
varying vec4 pos;

void main () {
  vec3 color = vec3(0);

  color.x = (sin(pos.w * 10.0) + 1.0) / 2.0;
  color.y = (cos(pos.w * 10.0) + 1.0) / 2.0;
  color.z = (cos(pos.z / 10.0) + 1.0) / 2.0;

  gl_FragColor = vec4(color, .007);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .005);
}