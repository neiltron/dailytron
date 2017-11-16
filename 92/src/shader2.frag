precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
uniform sampler2D textSrc;
varying vec2 pos;

const int blurLevel = 5;

void main() {
  vec2 _pos = pos;

  _pos = vec2(_pos.x + .5, _pos.y + .5);

  int blurLevel = 5;

  vec4 textColor = texture2D(textSrc, _pos);

  for (int i = 0; i < 20; i++){
    float blurAmount = sin(time) * .001 * float(i);

    textColor += texture2D(textSrc, vec2(_pos.x + blurAmount, _pos.y + blurAmount));
    textColor += texture2D(textSrc, vec2(_pos.x - blurAmount, _pos.y + blurAmount));
    textColor += texture2D(textSrc, vec2(_pos.x + blurAmount, _pos.y - blurAmount));
    textColor += texture2D(textSrc, vec2(_pos.x - blurAmount, _pos.y - blurAmount));
  }

  gl_FragColor = vec4(textColor / (float(20) * 4.0));
}
