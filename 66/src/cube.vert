precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;
varying vec3 _pos;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main () {
  _pos = position + pos;
  // _pos.y -= time * 3.0;

  _pos.y = _pos.y - mod(time * 5.0, 6.0);

  // 2 * Math.PI * i / items
  float angle = (3.1416 / 180.0) * ((20.0 - _pos.x) * 30.0);
  // _pos.z = sin(angle + time / 5.0);
  // _pos.x = cos(angle + time / 5.0);

  float cylinderZ = sin(angle + sin(time / 5.0));
  float cylinderX = cos(angle + sin(time / 5.0));

  float mixAmount = smoothstep((sin(time / 2.0) + 1.0) * 2.0, 0.0, 1.0);

  _pos.z = mix(cylinderZ, _pos.z, mixAmount);
  _pos.x = mix(cylinderX, _pos.x - 5.0, mixAmount);

  float n = snoise(vec3(_pos.x / 2.0, _pos.yz / 10.0 + time));
  _pos.z += n / 20.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
