precision highp float;

attribute vec2 uv;
varying vec2 vUv;
varying vec3 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

#pragma glslify: snoise = require('glsl-noise/classic/4d');

void main () {
  pos = texture2D(position, uv).xyz;
  vUv = uv;

  float nx = snoise(vec4(pos.xyz * 2.0, time));
  float ny = snoise(vec4(pos.yzx * 2.0, time));
  float nz = snoise(vec4(pos.zxy * 2.0, time));

  pos.x -= ((nx - 1.0) * 2.0) / 30.0;
  pos.y -= ((ny - 1.0) * 2.0) / 30.0;
  pos.z -= ((nz - 1.0) * 2.0) / 30.0;

  pos = mod(pos, 1.0);

  gl_Position = projection * view * vec4(pos.yzx, 1);
  gl_PointSize = 3.0;
}