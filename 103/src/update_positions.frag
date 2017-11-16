precision highp float;

varying vec4 pos;
varying vec2 vUv;
uniform sampler2D src;
uniform sampler2D inertiaSrc;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 _pos = texture2D(src, pos.xy);
  vec4 _inertia = texture2D(inertiaSrc, pos.xy);

  _pos.x += (_inertia.x) / 40000.0;
  _pos.y += (_inertia.y) / 40000.0;
  _pos.z += _inertia.z / 200000.0;

  _pos.x = mod(_pos.x, 1.0);
  _pos.y = mod(_pos.y, 1.0);
  _pos.z = mod(_pos.z, 1.0);

  gl_FragColor = vec4(_pos.xyzw);
}