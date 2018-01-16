precision highp float;

attribute vec3 xyz, normal;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
varying vec3 v_normal;
varying vec4 pos;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

void main () {
  vec3 pos = xyz;
  v_normal = normal;

  pos.xyz = rotateY(time / 10.0) * pos.xyz;
  pos.xyz = rotateX(time / 5.0) * pos.xyz;

  pos *= 7.0;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}