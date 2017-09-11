precision highp float;

uniform float time;
varying vec3 _pos;


void main() {
  gl_FragColor = vec4(sin(_pos.y / 20.0), sin(_pos.y / 50.0), sin(_pos.y / 50.0), .8);
}
