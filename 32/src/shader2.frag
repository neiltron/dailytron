precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
varying vec2 pos;


#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {

  vec2 _pos = pos.xy;
  // _pos.y = u_resolution.y - _pos.y;

  float dist = distance(u_mousepos.xy, pos.xy * u_resolution.xy);

  float n = snoise(vec3(pos.xy, time / 10.0));

  _pos -= n / 6.0;

  if (_pos.x > 1.0) {
    _pos.x -= 1.0;
  } else if (_pos.x < 0.0) {
    _pos.x += 1.0;
  }

  if (_pos.y > 1.0) {
    _pos.y -= 1.0;
  } else if (_pos.y < 0.0) {
    _pos.y += 1.0;
  }

  vec4 color = texture2D(state, vec2(_pos.x, _pos.y));

  gl_FragColor = vec4(color.rgb, 1);
}
