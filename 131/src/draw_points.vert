precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform sampler2D face;
varying vec4 v_face;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
const float DEG_TO_RAD = 3.141592653589793 / 180.0;

void main () {
  pos = 1.0 - 2.0 * texture2D(position, uv);
  pos.xyz = rotateY(time / 40.0) * pos.xyz;

  v_face = texture2D(face, uv);

  vec3 _pos = mix(vec3(uv.xy, v_face.z), pos.xyz, max(0.0, (cos(time / 2.0) + .8) / 200.0) + (.00005 * sin(time + v_face.y * 10.0)));
  _pos.xyz = rotateZ(180.0 * DEG_TO_RAD) * _pos;
  _pos *= 10.0;
  _pos.y += 5.0;
  _pos.x += 3.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
  gl_PointSize = floor(distance((pos.z / 80.0), 0.0)) / 2.0;
}