precision highp float;

attribute vec3 position;
// attribute vec2 uv;
// attribute vec3 normal;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform float time;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
varying vec3 _color;
varying vec2 v_uv;

varying vec3 pos;

#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)

const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  pos = position;
  v_uv = position.xy;

  float t = time / 2.0 - u_column / 10.0;

  pos = rotateX(t + 125.0 * DEG_TO_RAD + u_column + u_row) * pos;
  pos = rotateY(t + 40.0 * DEG_TO_RAD + ((u_column / u_row) / 1.5)) * pos;

  pos *= vec3(cos(position.y / u_row), sin(position.y + u_column + u_row), 1.0);
  pos *= 5.0;

  gl_PointSize = 1.0;
  gl_Position = projection * view * vec4(pos, 1);
}
