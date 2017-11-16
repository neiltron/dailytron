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

  float n_x = snoise(vec2((pos.xy + uv.xy) + time / 40.0));
  float n_y = snoise(vec2((pos.yx + uv.yx) + time / 40.0));

  pos.xy += vec2(n_x, n_y);

  float angle = u_resolution.x / (pos.x * u_resolution.x);

  pos.x = sin(angle * (3.14 / 180.0) + time / 20.0);
  pos.y = cos(angle * (3.14 / 180.0) + time / 20.0);
  pos.z = mod(pos.x + pos.y, sin(time * (cos(time / 4.4) + 1.5)) + 1.5);

  pos.xyz = rotateX((time / 1.0) * 2.0 * DEG_TO_RAD) * pos.xyz;
  pos.xyz = rotateZ((time / 1.0) * 4.0 * DEG_TO_RAD) * pos.xyz;
  // pos.xyz = rotateZ((time / 10.0) * 10.0 * DEG_TO_RAD) * pos.xyz;

  pos *= 2.0;
  pos.w = angle;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}