precision highp float;

uniform float time;
uniform float u_scroll_pos;
uniform float u_amplitude;
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

  // vec4 color = texture2D(u_texture, mix(coords, adjusted, u_amplitude) + vec2(0, u_scroll_pos));

  gl_FragColor = vec4(_color / 20.0, _color.z / 4.0);
}
