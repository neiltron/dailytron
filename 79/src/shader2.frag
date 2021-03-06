precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
uniform sampler2D textSrc;
varying vec2 pos;


// #pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {
  // float dist = 1.0 - distance(u_resolution.xy * -.13, pos.xy * u_resolution.xy);

  // vec2 _noisePos = vec2(pos.x, pos.y + time / 10.0);

  // float n = snoise(vec3(_noisePos, u_mousepos.y / u_resolution.y));
  vec2 _pos = pos;

  // float offset = mod(_pos.x, sin(time) / (u_resolution.x / 200.0)) * 2.0;

  // _pos.x += offset;


  // _pos.x = clamp(_pos, -1.0, 1.0);

  _pos = vec2(_pos.x / 3.0 + .5, _pos.y / 2.0 + 1.0);

  vec4 textColor = texture2D(textSrc, vec2(pos.x + .5, pos.y + 1.0));

  if (textColor.a > 0.0) {
    _pos.y -= sin(_pos.x / 10.0) / 2.0;
    _pos.x += .05;
  }

  vec4 color = texture2D(src, _pos);

  gl_FragColor = vec4(color);
}
