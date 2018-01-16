precision highp float;

uniform float time;
uniform sampler2D texture;
varying vec4 pos;
varying vec2 vUv;

void main () {
  vec4 texture = texture2D(texture, vUv.xy);
  vec4 color = vec4(texture.xyz, .7);

  gl_FragColor = vec4(color);
}