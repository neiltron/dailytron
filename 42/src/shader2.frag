precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D src;
varying vec2 pos;


// #pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {
  // float dist = 1.0 - distance(u_resolution.xy * -.13, pos.xy * u_resolution.xy);

  // vec2 _noisePos = vec2(pos.x, pos.y + time / 10.0);

  // float n = snoise(vec3(_noisePos, u_mousepos.y / u_resolution.y));
  vec2 _pos = pos;

  float offset = mod(_pos.x, sin(time) / (u_resolution.x / 200.0)) * 2.0;

  _pos.x += offset;


  // _pos.x = clamp(_pos, -1.0, 1.0);

  vec4 color = texture2D(src, vec2(_pos.x / 3.0 + .5, _pos.y / 2.0 + 1.0));


  if (color.rgb == vec3(1.0)) {
    float offset = (mod(pos.x, sin(time) / (u_resolution.x / 200.0)) * 2.0);
    float color = (_pos.x * offset) - _pos.y + .5;

    vec3 _color;

    _color.r = ((sin(color * time) + 1.0) / 2.0) * (1.0 - abs(_pos.x - pos.x));
    _color.g = ((cos(color * time) + 1.0) / 2.0) * (1.0 - abs(_pos.x - pos.x));
    _color.b = ((sin(color * time) + 1.0) / 2.0) * (1.0 - abs(_pos.x - pos.x));

    gl_FragColor = vec4(_color, 1);
  } else {
    gl_FragColor = vec4(color);
  }
}
