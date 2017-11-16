precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
attribute vec3 xyz, normal;
uniform mat4 projection, view;
uniform vec2 u_resolution;

varying vec3 v_normal;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: snoise = require('glsl-noise/simplex/3d');
const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  vec3 pos = xyz;
  v_normal = normal;

  pos.xyz = rotateY(time / 10.0) * pos.xyz;

  float n_x = snoise(vec3(pos.xyz + time / 20.0)) * sin(time / 5.0);
  float n_y = snoise(vec3(pos.yzx + time / 20.0)) * sin(time / 5.0);
  float n_z = snoise(vec3(pos.zxy + time / 20.0)) * sin(time / 5.0);

  pos.x += n_x;
  pos.y += n_y;
  pos.z += n_z;

  pos *= 3.0;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 4.0;
}