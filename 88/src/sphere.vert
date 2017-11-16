precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
uniform float offset;

attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 pos;
varying float dist;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vUv = uv;
  vNormal = normal;

  vec3 _pos = position;



  _pos *= offset > 1.0 ? 10.0 : 1.0;

  dist = distance(position.xy * u_resolution, u_mousepos - (u_resolution / 2.0));

  if (dist <= 200.0) {
    _pos.xy = (u_mousepos - (u_resolution / 2.0)) / u_resolution;
  }

  pos = _pos;


  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4(_pos.x, _pos.y, _pos.z, 1) * vec4(1, -1, 1, 1);
}
