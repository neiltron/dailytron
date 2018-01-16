precision highp float;

uniform float time;
varying vec4 pos;
varying vec3 v_normal;

void main () {
  vec3 color = vec3(0);

  color.x = (sin(v_normal.y * cos(time)) + 1.0) / 2.0;
  color.y = (sin(v_normal.y * cos(time)) + 1.0) / 2.0;
  color.z = (cos(v_normal.y * sin(time)) + 1.0) / 2.0;

  gl_FragColor = vec4(color, (color.x + color.y) / 2.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
}