precision highp float;

uniform float time;
varying vec4 pos;
varying vec4 v_face;
varying vec4 v_skull;

void main () {
  vec3 color = vec3(0);

  color.x = (sin(pos.w * 10.0) + 1.0) / 2.0;
  color.y = (cos(pos.w * 10.0) + 1.0) / 3.0;
  color.z = (cos(pos.z * 10.0) + 1.0) / 2.0;

  vec4 _color = mix(v_face, v_skull, smoothstep(-.98, .98, cos(time)));

  // gl_FragColor = vec4(color, .5);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  gl_FragColor = vec4(_color.rgb, 1.0);
}