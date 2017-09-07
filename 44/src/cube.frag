precision highp float;

uniform float time;
varying vec3 _pos;
varying float n;
varying vec4 color;


void main() {
  vec4 _color = vec4(0);

  _color.r += sin(smoothstep(n, .1, .2) ) * n;
  _color.g += sin(smoothstep(n, .2, .3) ) * n;
  _color.b += sin(smoothstep(n, .4, .6) ) * n;
  _color.rg += sin(smoothstep(n, .6, .8)) * n;
  _color.gb += sin(smoothstep(n, .7, 1.0)) * n;
  _color.rb += sin(smoothstep(n, .8, 1.0)) * n;

  gl_FragColor = _color;
}
