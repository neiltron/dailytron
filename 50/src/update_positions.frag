precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main () {
  vec3 pos = texture2D(src, uv).xyz;

  float n = snoise(vec3(pos.xy, time / 1.0));

  pos.x += ((sin(time) * cos(time)) / 100.0);
  pos.y += ((sin(time) * cos(time)) / 100.0);
  pos.z += sin(time / 10.0) / 5.3;

  gl_FragColor = vec4(pos, 1);
}