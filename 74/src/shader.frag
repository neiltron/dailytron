precision mediump float;

uniform float time;
uniform vec4 u_color;
uniform float u_index;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
varying vec2 pos;

void main() {

  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);
  float alpha = 0.0;

  if (dist < (u_index * 10.0)) {
    alpha =  1.0;
  }

  gl_FragColor = vec4(u_color.rgb, alpha);
}
