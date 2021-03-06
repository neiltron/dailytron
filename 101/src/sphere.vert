precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D src;
uniform float time;

varying vec3 pos;

void main () {
  vec3 _pos = position;
  vec4 _particlePos = texture2D(src, _pos.xy);

  _particlePos.y *= 2.0;

  // _pos /= 5.0;

  _pos.y -= 60.0;
  _pos.x -= 20.0;
  pos = _pos;

  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4((_pos.xyz + _particlePos.xyz) / 20.0, 1) * vec4(1, -1, 1, 1);
}
