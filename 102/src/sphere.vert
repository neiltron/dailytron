precision highp float;

attribute vec3 position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D src;
uniform float time;
uniform float index;

varying vec3 pos;

void main () {
  vec3 _pos = position;
  vec4 _particlePos = texture2D(src, vec2(3.0 / index, 0));


  // _pos /= 5.0;

  // _pos.y += 2.0;
  // _pos.x -= (index * .5);
  pos = _pos + vec3(.5, 0.0, 0.0);

  gl_PointSize = 3.0;
  gl_Position = projection * view * vec4(pos.xy + _particlePos.xy - 5.0, pos.z, 1);
}
