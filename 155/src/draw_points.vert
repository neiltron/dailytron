precision highp float;

attribute vec2 uv;
varying vec4 pos;
varying vec2 vUv;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;


void main () {
  vUv = uv;
  pos = texture2D(position, uv.xy) - vec4(0, .75, 0, 0);
  pos.xyz *= vec3(10., 10., 20.0);
  // pos.y = (pos.y - .5);
  // pos.y /= 10.0;

  pos.xy = uv.xy * pos.xy;

  gl_Position = projection * view * vec4(1.0 - 2.0 * pos.xyz, 1.0);
  gl_PointSize = 2.;
}