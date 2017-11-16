precision highp float;

uniform float time;
varying vec4 pos;
varying vec3 v_normal;

void main () {
  vec3 color = vec3(0);

  color.x = (sin(v_normal.y) + 1.0) / 2.0;
  color.y = (sin(v_normal.y) + 1.0) / 2.0;
  color.z = (cos(v_normal.y) + 1.0) / 2.0;

  // vec4 _color = mix(v_face, v_skull, smoothstep(-.98, .98, cos(time)));

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
  // gl_FragColor = vec4(_color.rgb, 1.0);
}