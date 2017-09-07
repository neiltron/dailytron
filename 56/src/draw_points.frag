precision highp float;

uniform float time;
varying vec2 vUv;
varying vec3 pos;

void main () {
  vec3 color = vec3(0);

  color.r = (cos(pos.y) + .5) / 2.0;
  color.g = (cos(pos.x) + .5) / 2.0;
  color.b = (cos(pos.z) + .5) / 2.0;

  if (color == vec3(1.0)) {
    color = vec3(1.0);
  }

  gl_FragColor = vec4(color, .1);
}