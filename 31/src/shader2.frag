precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
varying vec2 pos;

void main() {

  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_mousepos.xy, pos.xy * u_resolution.xy);
  vec4 color = texture2D(state, vec2(pos.x, pos.y));

  gl_FragColor = vec4(color.rgb, 1);
}
