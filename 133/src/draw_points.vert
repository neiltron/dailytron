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
const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  vec3 pos = xyz;
  v_normal = normal;

  pos.xyz = rotateY(time / 10.0) * pos.xyz;
  pos.xyz += (1.0 - 2.0 * texture2D(position, uv).xyz) / (10000.0 * max(sin(time), 0.1));

  // vec3 _pos = mix(vec3(uv.xy, v_face.z), vec3(uv.xy, v_skull.z), smoothstep(-.98, .98, cos(time)));
  // _pos.xyz = rotateZ(180.0 * DEG_TO_RAD) * _pos;
  // _pos *= 10.0;
  pos.y += .1;
  // _pos.x += 3.0;

  pos *= 10.0;

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}