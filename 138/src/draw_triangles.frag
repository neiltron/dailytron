precision highp float;

uniform float time;
uniform sampler2D u_reflection;
uniform vec2 u_resolution;
varying vec3 v_normal;
varying vec4 pos;
varying vec2 vUv;

void main () {
  vec3 color = vec3(1);
  vec3 highlight_color = vec3(1, 0, 1);

  vec4 reflection_color = texture2D(u_reflection, (v_normal.xy + vUv.xy));
  // color = mix(color, reflection_color.xyz, distance(pos.xyz, vec3(0.0)));

  // vec3 light_source = vec3(sin(time), cos(time), sin(time) * cos(time));
  // color = mix(color, highlight_color, distance(v_normal.xyz, light_source));

  gl_FragColor = vec4(reflection_color.xyz, 1.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
  // gl_FragColor = vec4(_color.rgb, 1.0);
}