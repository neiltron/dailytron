precision highp float;

uniform float time;
uniform sampler2D u_reflection;
varying vec2 v_uv;
varying vec4 pos;
varying vec3 v_normal;

void main () {
  vec3 color = vec3(0);
  vec3 highlight_color = vec3(1, 0, 1);

  vec4 reflection_color = texture2D(u_reflection, v_uv * 2.0);
  color = mix(color, reflection_color.xyz, distance(v_normal, vec3(0.0)));

  vec3 light_source = vec3(sin(time), cos(time), sin(time) * cos(time));
  color = mix(color, highlight_color, distance(v_normal.xyz, light_source));

  gl_FragColor = vec4(smoothstep(.6, 1.0, reflection_color.xyz / sin(time + v_normal.x * v_normal.y * v_normal.z)), 1.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
  // gl_FragColor = vec4(_color.rgb, 1.0);
}