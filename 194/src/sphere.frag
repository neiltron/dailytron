precision highp float;

uniform float time;
uniform float u_pixel_ratio;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
uniform vec2 u_resolution;

varying vec3 _color;
varying vec3 pos;
varying vec2 v_uv;

void main() {
  vec3 _pos = pos;

  vec3 red = vec3(1.0, 0, 0);
  vec3 yellow = vec3(1.0, .8, 0);

  vec3 _color = mix(red, yellow, (sin(time - (pos.x)) + 1.0) / 5.0);

  float color = 1.0 - min(0.8, distance(v_uv.y / 1.0, mod(time, 5.0)) * 5.0);
  color -= v_uv.x * 10.0;
  float alpha = 1.0;

  gl_FragColor = vec4(_color * color, alpha);
}
