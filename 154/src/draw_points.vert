precision highp float;
#define GLSLIFY 1

attribute vec2 uv;
varying vec4 pos;
varying vec2 vUv;
varying vec2 center;
varying float centerHeight;
uniform float time;
uniform sampler2D src;
uniform mat4 projection, view;

void main () {
  vUv = uv;
  pos = texture2D(src, vUv);

  center = vec2(0);

  centerHeight = texture2D(src, 2.0 * center - 1.0).y + .1;

  gl_Position = projection * view * vec4(pos.xyz - vec3(8.45, centerHeight, 7.65), 1.0);
  gl_PointSize = 1.5;
}