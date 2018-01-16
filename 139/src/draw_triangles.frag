precision highp float;

uniform float time;
uniform sampler2D u_reflection;
uniform vec2 u_resolution;
varying vec3 v_normal;
varying vec4 pos;
varying vec2 vUv;

void main () {
  vec3 color = vec3(.2);
  vec3 highlight_color = vec3(1, 1, 1);

  vec4 reflection_color = texture2D(u_reflection, v_normal.xy - vUv.xy);
  reflection_color = mix(reflection_color, texture2D(u_reflection, v_normal.xy - vUv.xy * 1.01) * vec4(2.0, 1, 1, 1), .5);
  reflection_color = mix(reflection_color, texture2D(u_reflection, v_normal.xy - vUv.xy * 1.02) * vec4(1, 2.0, 1, 1), .4);
  reflection_color = mix(reflection_color, texture2D(u_reflection, v_normal.xy - vUv.xy * 1.03) * vec4(1, 1, 2.0, 1), .3);

  color = mix(reflection_color.xyz, color, .5);

    // max(0.0, dot(lightDir, normal)
    // reflection_color = mix(reflection_color, texture2D(u_reflection, v_normal.xy + vUv.xy);
    // reflection_color += texture2D(u_reflection, (v_normal.xy + vUv.xy - float(i) / 300.0)), .1);
  // color = mix(color, reflection_color.xyz, distance(pos.xyz, vec3(0.0)));

  vec3 light_source = vec3(0.0, .5, .3);
  color = mix(color, highlight_color, .5 - distance(v_normal.xyz / pos.xyz, light_source));

  gl_FragColor = vec4(color.xyz, 1.0);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, .4);
  // gl_FragColor = vec4(_color.rgb, 1.0);
}