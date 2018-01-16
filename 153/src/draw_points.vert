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

  centerHeight = texture2D(src, center).y;

  gl_Position = projection * view * vec4(vec3(100.0, 50.0, 100.0) * pos.xyz - vec3(0, centerHeight * 50.0, 0), 1.0);
  gl_PointSize = 4.0;
}