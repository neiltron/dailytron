precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D src;
uniform sampler2D textSrc;
varying vec2 pos;

const int blurLevel = 5;

void main() {
  vec2 _pos = pos;

  _pos = vec2(_pos.x + 1.0, _pos.y + 1.0);


  // vec4 textColor = vec4(0.0);
  // float blurLevel = .0005;
  // float blurAmount;

  // for (float i = 0.0; i < 10.0; i++){

  //   blurAmount = (1.0 - ((sin(time / 4.0) + 1.0) / 2.0)) * blurLevel * i;

  //   textColor += texture2D(textSrc, vec2(_pos.x + blurAmount, _pos.y + blurAmount));
  //   textColor += texture2D(textSrc, vec2(_pos.x - blurAmount, _pos.y + blurAmount));
  //   textColor += texture2D(textSrc, vec2(_pos.x + blurAmount, _pos.y - blurAmount));
  //   textColor += texture2D(textSrc, vec2(_pos.x - blurAmount, _pos.y - blurAmount));
  // }

  vec4 textColor = texture2D(textSrc, _pos / 2.0);


  if (textColor.rgb == vec3(1)) {
    textColor.rgb = vec3((sin(pos.y) + 1.0));
  }

  gl_FragColor = vec4(textColor.rgba);
}
