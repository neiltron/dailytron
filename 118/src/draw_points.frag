precision highp float;

uniform float time;
varying vec4 pos;

void main () {
  vec3 color = vec3(0);

  color.x += (sin((pos.x + pos.z) / 5.0) + 1.0) / 2.0;
  color.y += (sin((pos.y + pos.z) / 5.0) + 1.0) / 2.0;
  color.z += (sin(pos.z / 5.0) + 1.0) / 2.0;

  gl_FragColor = vec4(color, .04);
  // gl_FragColor = vec4(1.0);
}