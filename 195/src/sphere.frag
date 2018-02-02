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

  vec3 red = vec3(1., 0, 0);
  vec3 yellow = vec3(1., .9, 0);

  vec3 _color = mix(red, yellow, (sin(time + u_row + u_column) + 1.0));

  float color = 1.0 - min(.6, distance(v_uv.y, mod(time, u_row / u_column)) * 5.0);
  color -= v_uv.x * 10.0;
  float alpha = .06;

  gl_FragColor = vec4(_color * color, color / 5.0);
}
