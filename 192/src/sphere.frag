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
uniform float u_offset;
uniform float u_column;
uniform float u_row;

varying vec3 _color;
varying vec3 pos;
// varying vec3 v_normal;
varying vec2 v_uv;

void main() {
  vec3 _pos = pos;

  vec3 red = vec3(.6, 0, 0);
  vec3 yellow = vec3(.6, .5, 0);

  vec3 _color = mix(yellow, red, (sin(time - (pos.x)) + 1.0) / 5.0);

  float color = 1.0 - max(0.0, distance(v_uv.y / 1.0, mod(time * 5.0, 5.0)) * 5.0);
  color -= v_uv.x * 10.0;
  float alpha = .8;

  gl_FragColor = vec4(_color * color, alpha);
}
