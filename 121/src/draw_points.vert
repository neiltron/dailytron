precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  pos = texture2D(position, uv);

  float dist_x = smoothstep(0.0, .1, distance(u_mousepos.x, uv.x) / (u_resolution.x * 10.0));
  float dist_y = smoothstep(0.0, .1, distance(u_mousepos.y, uv.y) / (u_resolution.y * 10.0));

  float n_x = snoise(vec3(pos.x, uv.x, dist_x));
  float n_y = snoise(vec3(pos.y, uv.y, dist_y));
  float n_z = snoise(vec3(pos.z, (uv.x + uv.y) / 2.0, (dist_x + dist_y) / 2.0));

  pos.xyz *= 40.0;
  pos.y -= 2.0;
  pos.z -= 2.0;
  pos.x -= 2.0;

  pos.xyz += vec3(n_x, n_y, n_z);

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 2.0;
}