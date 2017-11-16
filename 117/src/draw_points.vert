precision highp float;

attribute vec2 uv;
varying vec4 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  pos = texture2D(position, uv);

  // float angle = uv.x / .1;

  // pos.z = sin(angle) * (pos.z + pos.y);
  // pos.y = cos(angle) * pos.x;

  // pos.x *= sin(time / 2.0);

  pos.xyz *= 40.0;
  pos.y -= 3.0;
  // pos.z -= 3.0;
  pos.x -= 4.0;

  // pos.z += sin(sin(time) * pos.x) * cos(sin(time) * pos.y);

  gl_Position = projection * view * vec4(pos.xyz, 1);
  gl_PointSize = 3.0;
}