precision highp float;

uniform float time;
uniform float u_scroll_pos;
uniform float u_amplitude;
uniform float u_pixel_ratio;
uniform bool u_lines;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
varying vec3 pos;
varying vec2 vUv;
varying vec3 _color;


void main () {
  vec3 red = vec3(.2, 0, 0) * _color.zzz;
  vec3 yellow = vec3(.2, .1, 0) * _color.zzz;

  vec3 color = mix(red, yellow, (sin(time - (pos.y / 3.0)) + 1.0) / 5.0);

  gl_FragColor = vec4(color, .7);

  // gl_FragColor = u_lines ? vec4(vec3(.3), .5) : vec4(color.xyz, 1.0);

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}