precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D src;
uniform float time;
varying vec3 v_pos;

#pragma glslify: rotate = require(glsl-y-rotate)

void main () {
  v_pos = position;

  v_pos.x -= .2;
  v_pos.y -= .1;
  // v_pos.z -= 6.0;

  v_pos *= 20.0;

  v_pos.xy = rotate(sin(time / 10.0 + 1.0)) * v_pos.xy;
  // v_pos = rotateY(time / 20.0) * 0.0 * v_pos;
  // v_pos = rotateX(time / 20.0) * v_pos;

  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4(v_pos.xyz, 1) * vec4(1, -1, -.4, 1);
}
