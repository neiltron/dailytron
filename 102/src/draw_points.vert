precision highp float;

attribute vec2 uv;
varying vec3 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  pos = texture2D(position, vec2(uv.xy)).xyz;

  gl_Position = projection * view * (vec4(pos, 1));
  gl_PointSize = 3.0;
}