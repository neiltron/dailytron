precision mediump float;

uniform float time;
uniform vec2 u_resolution;
varying vec2 pos;


#pragma glslify: snoise = require('glsl-noise/classic/3d');

void main() {
  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);
  vec3 color = vec3(1.0, 1.0, 1.0);

  // if (dist < 150.0) {
    color.gb = vec2(sin(dist * 2.0));
    color.r = sin(dist * 2.01);
  // }

  gl_FragColor = vec4(color.rgb, 1);
}
