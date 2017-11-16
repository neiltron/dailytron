precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;

uniform sampler2D face;
varying vec4 v_face;

uniform sampler2D skull;
varying vec4 v_skull;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  pos = 1.0 - 2.0 * texture2D(position, uv);
  pos.xyz = rotateY(time / 40.0) * pos.xyz;

  v_face = texture2D(face, uv);
  v_skull = texture2D(skull, uv);

  vec3 _pos = mix(vec3(uv.xy, v_face.z), vec3(uv.xy, v_skull.z), smoothstep(-.98, .98, cos(time)));
  _pos.xyz = rotateZ(180.0 * DEG_TO_RAD) * _pos;
  _pos *= 10.0;
  _pos.y += 5.0;
  _pos.x += 3.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
  gl_PointSize = floor(distance((pos.z / 10.0), 0.0)) / 2.0;
}