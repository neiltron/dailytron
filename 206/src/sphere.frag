precision highp float;

uniform float time;
uniform float u_pixel_ratio;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
uniform float u_total_rows;
uniform vec2 u_resolution;

varying vec3 _color;
varying vec3 pos;
varying vec3 v_normal;
varying vec3 v_uv;
varying vec3 v_noise;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 _pos = pos;
  vec2 xy = pos.xy;

  vec3 black = vec3(0.1 + v_noise.x, .1 + v_noise.z, 0.1 + v_noise.y);
  vec3 white = vec3(1.0, 1.0, 1.0);

  // vec3 _color = mix(black, white, xy.y / 50.0);
  vec3 _color = vec3(1.0);

  // float r = (sin(1.0 - v_uv.x / 800.0) + 1.0) / 2.0;
  // float g = (sin(1.0 - v_uv.y / 800.0) + 1.0) / 1.8;
  // float b = (sin(1.0 - v_uv.z / 800.0) + 1.0) * .5;
  // vec3 _color = vec3(r, g, b);

  vec3 light = vec3(sin(time), cos(time), 0.0);

  _color -= min(max(0.0, pos.y / 70.0), .4);
  // _color -= (1.0 - pos.y / 80.0) / 10.0;

  _color /= distance(pos, light);

  _color += cross(v_normal, light);

  // gl_FragColor = vec4(1);
  gl_FragColor = vec4(hsv2rgb(_color), 1.0);
}
