precision highp float;

uniform float time;
uniform sampler2D src;
varying vec2 pos;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  // float n = snoise(vec3(_pos.x / 2.0, _pos.xy / 10.0 + (time / 3.0))) / 5.0;

  vec2 _pos = pos;
  // _pos.y += .5;
  // _pos.x += .5;

  // vec4 color = texture2D(src, mod(_pos.xy + 1.0, .5));

  gl_FragColor = vec4(1.0);
}
