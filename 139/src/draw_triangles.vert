precision highp float;

attribute vec3 xyz;
attribute vec3 normal;
attribute vec2 uv;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
varying vec3 v_normal;
varying vec2 vUv;
varying vec4 pos;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)

void main () {
  pos = vec4(xyz, 1);
  v_normal = normal;

  float time_offset = (sin(time) + .2) * 2.0;

  pos.xyz = rotateY(time_offset) * pos.xyz;
  pos.xyz = rotateZ(time_offset) * pos.xyz;

  pos.xyz *= 15.0;
  pos = projection * view * vec4(pos.xyz, 1);

  gl_Position = pos;
  gl_PointSize = 3.0;

  vec2 clipSpace = gl_Position.xy / gl_Position.w;
  vUv = clipSpace;
}