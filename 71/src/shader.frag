precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
varying vec2 pos;

void main() {

  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float mouseDist = distance(u_resolution.xy / 2.0, u_mousepos.xy);
  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);
  vec3 color = vec3(1.0);

  if (dist < u_resolution.y / 3.0) {
    color.rgb = 1.0 - vec3(mod(mouseDist, 60.0) / dist);
  }

  gl_FragColor = vec4(color, 1);
}
