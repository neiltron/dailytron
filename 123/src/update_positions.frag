precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, uv);

  _pos.x = (u_mousepos.x / u_resolution.x);
  _pos.y = (u_mousepos.y / u_resolution.y);

  _pos.z = 0.0;

  gl_FragColor = vec4(_pos.xyz, 1);
}