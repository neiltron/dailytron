precision highp float;

varying vec2 uv;
varying vec4 pos;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

void main () {
  vec4 _pos = texture2D(src, uv);

  float _mod = .2;
  float _modPosX = 1.0 - 2.0 * uv.x;
  float _modPosY = 1.0 - 2.0 * uv.y;

  _pos.x = .5 + mod(_modPosX, _mod) * (_mod / (uv.x / 2.0));
  _pos.y = .5 + mod(_modPosY, _mod) * (_mod / (uv.y / 2.0));

  gl_FragColor = vec4(_pos.xyz, 1);
}