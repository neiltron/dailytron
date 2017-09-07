precision highp float;

uniform float time;
varying vec2 vUv;
varying vec3 pos;

void main () {
  vec3 color = vec3(0);

  color.r = (cos(pos.x));
  color.g = (cos(pos.y));
  color.b = (cos(pos.z));

  gl_FragColor = vec4(color, .8);
}