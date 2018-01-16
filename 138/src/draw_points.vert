precision highp float;

// attribute vec2 uv;
varying vec4 pos;
// varying vec2 v_uv;
uniform float time;
uniform sampler2D position;
attribute vec3 xyz;
uniform mat4 projection, view;
uniform vec2 u_resolution;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: snoise = require('glsl-noise/simplex/3d');
const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  vec3 pos = xyz;

  float n_x = snoise(vec3(pos.xyz + time / 20.0)) * ((sin(time / 20.0) + 1.5) / 2.0);
  float n_y = snoise(vec3(pos.yzx + time / 20.0)) * ((sin(time / 20.0) + 1.5) / 2.0);
  float n_z = snoise(vec3(pos.zxy + time / 20.0)) * ((sin(time / 20.0) + 1.5) / 2.0);

  // pos.x += (n_x / 10.0) * sin(time + v_normal.x * v_normal.y * v_normal.z);
  // pos.y += (n_y / 10.0) * sin(time + v_normal.x * v_normal.y * v_normal.z);
  // pos.z += (n_z / 10.0) * sin(time + v_normal.x * v_normal.y * v_normal.z);

  float time_offset = (sin(time) + .2) * 2.0;

  pos.xyz = rotateY(min(-0.25, 1.0 + 4.0 * time_offset)) * pos.xyz;
  pos.xyz = rotateZ(min(-0.25, 1.0 + time_offset)) * pos.xyz;

  pos.xyz *= 7.0;


  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 4.0;
}