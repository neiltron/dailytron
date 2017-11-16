precision highp float;

attribute vec2 xy, uv;
uniform float time;
varying vec2 vUv;
varying vec4 pos;

void main () {
  vUv = uv;
  vec2 _xy = 0.5 * xy + 0.5;
  pos = vec4(_xy, _xy);

  // pos.y -= 2.0;
  // pos.z -= 10.0;

  gl_Position = vec4(xy, 0, 1);
}