precision mediump float;

uniform float time;
uniform vec2 u_resolution;
uniform sampler2D state;
uniform sampler2D circleSrc;
varying vec2 pos;


#pragma glslify: snoise = require('glsl-noise/classic/3d');

vec4 getCircle(float offset) {
  float n = snoise(vec3(pos.xy, offset));
  vec2 _pos = pos.xy;

  _pos -= n / 2.0;

  return texture2D(circleSrc, vec2(_pos.x, _pos.y));
}

void main() {
  vec4 color = texture2D(state, vec2(pos.x, pos.y));

  vec4 _circle = getCircle(time / 2.0);
  if (_circle.rgb != vec3(1, 1, 1)) {
    // color = mix(color, _circle, .6);
    color -= _circle;
  }

  _circle = getCircle(time / 3.0);
  if (_circle.rgb != vec3(1, 1, 1)) {
    // color = mix(color, _circle, .6);
    color -= _circle;
  }

  _circle = getCircle(time / 4.0);
  if (_circle.rgb != vec3(1, 1, 1)) {
    // color = mix(color, _circle, .6);
    color -= _circle;
  }

  _circle = getCircle(time / 5.0);
  if (_circle.rgb != vec3(1, 1, 1)) {
    // color = mix(color, _circle, .6);
    color -= _circle;
  }

  gl_FragColor = vec4(color.rgb, 1);
}
