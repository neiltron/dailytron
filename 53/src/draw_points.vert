precision highp float;

attribute vec2 uv;
varying vec3 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  pos = texture2D(position, uv).xyz;

  float angle = uv.x / .1;

  pos.z = sin(angle);
  pos.y = cos(angle);

  pos.x *= 1000.0 * sin(time / 1.5);

  gl_Position = projection * view * vec4(pos.yzx, 1);
  gl_PointSize = 3.0;
}