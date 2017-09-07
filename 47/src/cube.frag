precision highp float;

uniform float time;
varying vec3 _pos;
varying float n;
varying vec4 color;


void main() {
  vec4 _color = vec4(0);

  _color.r += ((sin(smoothstep(n, .1, .3) ) + 1.0) / 2.0) * n;
  _color.g += ((sin(smoothstep(n, .2, .4) ) + 1.0) / 2.0) * n;
  _color.b += ((sin(smoothstep(n, .3, .5) ) + 1.0) / 2.0) * n;
  _color.rg += ((sin(smoothstep(n, .6, .8)) + 1.0) / 2.0) * n;
  _color.gb += ((sin(smoothstep(n, .7, 1.0)) + 1.0) / 2.0) * n;
  _color.rb += ((sin(smoothstep(n, .8, 1.0)) + 1.0) / 2.0) * n;

  gl_FragColor = _color;
}
