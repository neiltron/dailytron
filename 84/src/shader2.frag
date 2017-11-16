precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
uniform sampler2D textSrc;
varying vec2 pos;

void main() {
  vec2 _pos = pos;

  _pos = vec2(_pos.x + .5, _pos.y + .5);

  vec4 textColor = texture2D(textSrc, _pos);

  gl_FragColor = vec4(textColor);
}
