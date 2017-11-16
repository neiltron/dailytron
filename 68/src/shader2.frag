precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
varying vec2 pos;


// #pragma glslify: snoise = require('glsl-noise/classic/3d');
#pragma glslify: blur9 = require('glsl-fast-gaussian-blur/13')

void main() {
  vec2 _pos = pos;
  // vec4 color = texture2D(src, vec2(_pos.x, _pos.y));

  vec4 _color = blur9(src, _pos.xy, u_resolution.xy, vec2(1.2));
  vec4 color = texture2D(src, vec2(_pos.x, _pos.y));

  _color.r -= _pos.x;
  _color.b -= _pos.y;

  gl_FragColor = vec4(color * 1.0 + _color * 1.5);
}
