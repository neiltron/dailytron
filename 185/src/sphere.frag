precision highp float;

uniform float time;
uniform float u_scroll_pos;
uniform float u_amplitude;
uniform vec2 u_mousepos;
uniform float u_pixel_ratio;
uniform bool u_lines;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform bool lines;

varying vec3 _color;
varying vec3 pos;
varying vec3 v_normal;
varying vec2 v_uv;

void main() {
  vec3 _pos = pos;

  // vec2 coords = (2.0 - u_pixel_ratio + 1.0) * (v_normal.xy / _color.xy);
  // vec2 adjusted = coords.xy * (v_normal.xy * vec2(-1.0, -u_amplitude)) + .5;

  vec3 red = vec3(.2, 0, 0) * _color.zzz;
  vec3 yellow = vec3(.2, .1, 0) * _color.zzz;

  vec3 color = mix(red, yellow, (sin(time - (pos.y / 3.0)) + 1.0) / 5.0);

  gl_FragColor = vec4(color / v_normal.yyy / 2.0, min(pos.y * _color.z, 1.0) / 5.0);
}
