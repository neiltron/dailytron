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

  // if (dist < u_index * u_index * u_index) {
    color =  mod(dist, 60.0 + (dist / 100.0 * ((u_mousepos.y / u_resolution.y) * u_index))) / dist;

    // color = 1.0 - mod(dist + u_index, 60.0 + time);
  // }

  gl_FragColor = vec4(vec3(color), 1);
}
