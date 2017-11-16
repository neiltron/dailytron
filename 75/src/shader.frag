precision mediump float;

uniform float time;
uniform float u_index;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
varying vec2 pos;

void main() {
  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);
  float color = 1.0;

  color = mod(dist, 60.0 + ((dist + u_mousepos.x / u_index) / 100.0 * ((u_mousepos.y / u_resolution.y) * u_index))) / dist;

  gl_FragColor = vec4(vec3(color * ((sin(time) + 1.0) * 2.0)), 1);
}
