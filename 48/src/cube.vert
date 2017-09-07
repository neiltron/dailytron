precision highp float;

attribute vec3 position, normal;
uniform vec2 u_resolution;
uniform float time;
uniform vec3 pos;
uniform mat4 projection, view;

varying vec3 _pos;
varying vec4 color;

void main () {
  _pos = position + pos;

  float offset = mod(_pos.x / 20.0, (abs(sin(time / 10.0)) + .5) / (u_resolution.x / 200.0));

  // z = sin(uv.x * 2.0 + time) * cos(uv.y * 2.0 + time / 2.0) / 2.0;
  float _dist = distance(_pos.xy, vec2(0, 0));

  float _sin = sin(smoothstep(_dist / ((sin(time / 2.0)) * 150.0), 0.2, .8) * 10.0);
  float _cos = cos(smoothstep(_dist / ((sin(time / 2.0)) * 150.0), 0.2, .8) * 10.0);
  _pos.z += (_sin * _cos) * 10.0;
  // _pos.z += sin(smoothstep(_dist / (((sin(time / 2.0) + 1.5) / 2.0) * 50.0), 0.2, 1.0) * 20.0 + time) * cos(smoothstep(_dist / (((sin(time / 2.0) + 1.5) / 2.0) * 50.0), 0.2, 1.0) * 20.0 + time) * 10.0;
  // _pos.z += ((sin((abs(_pos.x - 99.0) + abs(_pos.y - 99.0)) * sin(_time / 2.0) / 10.0)) + 1.0) / 2.0 * 20.0;

  gl_Position = projection * view * vec4(_pos.xyz, 1);
}
