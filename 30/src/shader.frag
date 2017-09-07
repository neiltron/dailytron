precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
varying vec2 pos;

void main() {

  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_mousepos.xy, pos.xy * u_resolution.xy);
  vec3 color = vec3(1.0);

  if (dist < 150.0) {
    color.rb = vec2(sin(dist * 3.0));
    color.g = cos(dist * 3.0);
  }

  gl_FragColor = vec4(color, 1);
}
