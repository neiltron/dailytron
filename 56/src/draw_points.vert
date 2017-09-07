precision highp float;

attribute vec2 uv;
varying vec2 vUv;
varying vec3 pos;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;

void main () {
  pos = texture2D(position, uv).xyz;
  vUv = uv;

  float angle = 20.0 / (uv.x * 2.0);

  pos.x = (sin(angle));
  pos.y = (cos(angle));

  pos.z += sin(angle + (sin(time / 10.0) * cos(time / 10.0) * 10.0));

  gl_Position = projection * view * vec4(pos.yzx, 1);
  gl_PointSize = 3.0;
}