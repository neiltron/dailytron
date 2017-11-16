precision mediump float;

uniform float time;
uniform float u_zindex;
uniform float u_index;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float u_circle_count;
varying vec2 pos;
varying float circleNum;

void main() {

  vec2 _pos = gl_FragCoord.xy;
  _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);
  float alpha = 0.0;

  float circleSize = u_resolution.x / 4.0;

  if (dist > circleSize) {
    alpha = 1.0 - (u_zindex / (u_circle_count - 5.0));
  }

  float color = .2 - (dist - circleSize) / (u_resolution.y * 6.0);

  // vec3 color = mix(u_color.xyz, vec3(smoothstep(dist, .5, .8)), vec3(.5));
  // alpha = alpha * smoothstep(dist, 30.0 * circleNum, 50.0 * circleNum);

  gl_FragColor = vec4(vec3(color), alpha);
}
