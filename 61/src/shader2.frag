precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
varying vec2 vUv;


void main() {
  vec4 color = texture2D(src, vUv);

  gl_FragColor = vec4(1.0);
}
