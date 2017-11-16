precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/2d');
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)

const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  pos = 1.0 - 2.0 * texture2D(position, uv);

  pos.x *= 8.0;
  pos.y *= 4.6;

  float n_x = snoise(vec2((pos.xy + uv.xy) + time / 4.0));
  float n_y = snoise(vec2((pos.yx + uv.yx) + time / 4.0));

  pos.xy += vec2(n_x, n_y);

  float angle = u_resolution.x / (pos.x * u_resolution.x);

  pos.x = sin(angle * (3.14 / 180.0) + time);
  pos.y = cos(angle * (3.14 / 180.0) + time);

  pos.xyz = rotateX((time / 10.0) * 15.0 * DEG_TO_RAD) * pos.xyz;
  pos.xyz = rotateY((time / 10.0) * 20.0 * DEG_TO_RAD) * pos.xyz;
  // pos.xyz = rotateZ((time / 10.0) * 10.0 * DEG_TO_RAD) * pos.xyz;

  pos *= 3.0;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}