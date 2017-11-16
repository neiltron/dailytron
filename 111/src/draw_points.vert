precision highp float;

attribute vec2 uv;
varying vec3 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  pos = texture2D(position, uv).xyz;

  // float angle = uv.x / .1;

  // pos.z = sin(angle) * (pos.z + pos.y);
  // pos.y = cos(angle) * pos.x;

  // pos.x *= sin(time / 2.0);

  pos *= 4.0;
  pos.y -= 2.0;
  pos.z -= 2.0;
  pos.x -= 1.5;

  gl_Position = projection * view * vec4((pos.yz), pos.x, 1);
  gl_PointSize = 3.0;
}