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

  vec4 _color = vec4(1);

  for (float i = 0.0; i < 5.0; i += .25) {
    _color -= blur9(src, _pos.xy, u_resolution.xy, vec2(i)) * vec4(sin(time), sin(time), sin(time), 1.0);
  }
  vec4 color = texture2D(src, vec2(_pos.x, _pos.y));

  gl_FragColor = vec4(_color * (sin(time) + .8));
}
