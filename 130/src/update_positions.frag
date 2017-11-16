precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform sampler2D speed;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/2d');

void main () {
  vec4 _pos = texture2D(src, uv);
  vec4 speed = texture2D(speed, uv);

  _pos.xyz = speed.xyz / 500.0;

  // _pos = mod(_pos, 2.0);

  gl_FragColor = vec4(_pos.xyzw);
}