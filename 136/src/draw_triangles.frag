precision highp float;

uniform float time;
varying vec4 pos;
varying vec3 v_normal;

void main () {
  vec3 color = vec3(1);
  vec3 highlightColor = vec3(1, 0, 1);


  vec3 light_source = vec3(sin(time), cos(time), sin(time) * cos(time));

  color = mix(color, highlightColor, distance(v_normal.xyz, light_source));

  // vec4 _color = mix(v_face, v_skull, smoothstep(-.98, .98, cos(time)));

  gl_FragColor = vec4(color, (color.x + color.y) / 5.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
  // gl_FragColor = vec4(_color.rgb, 1.0);
}