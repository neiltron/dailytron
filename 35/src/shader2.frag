precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D state;
uniform sampler2D circleSrc;
uniform sampler2D mouseSrc;
varying vec2 pos;


#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {
  float dist = 1.0 - distance(u_resolution.xy * -.13, pos.xy * u_resolution.xy);
  float n = snoise(vec3(pos.xy, u_mousepos.y / u_resolution.y));

  vec4 color = texture2D(circleSrc, vec2(pos.x * (n / (dist / 10.0)), pos.y * (n / (dist / 10.0))));

  gl_FragColor = vec4(color.rgba);
}
