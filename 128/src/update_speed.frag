precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform sampler2D inertia;
uniform sampler2D position;
uniform sampler2D prevPosition;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec4 speed = texture2D(src, uv);
  vec4 inertia = texture2D(inertia, uv);
  vec4 position = texture2D(position, uv);
  vec4 prevPosition = texture2D(prevPosition, uv);

  float n_x = snoise(vec3(uv.xyx));


  vec4 _pos = (position - prevPosition) + inertia * n_x;

  gl_FragColor = vec4(_pos.xyz, 1);
}