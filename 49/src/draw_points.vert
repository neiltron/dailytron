precision mediump float;

attribute vec2 uv;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  vec3 pos = texture2D(position, uv).xyz;

  gl_Position = projection * view * vec4(pos.yzx, 1);
  gl_PointSize = 3.0;
}