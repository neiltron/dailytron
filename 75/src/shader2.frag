precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform sampler2D image;
uniform sampler2D src;
varying vec2 pos;


// #pragma glslify: snoise = require('glsl-noise/classic/3d');
#pragma glslify: blur9 = require('glsl-fast-gaussian-blur/13')

void main() {
  vec2 _pos = pos;

  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);

  vec4 color = texture2D(src, _pos.xy);
  vec2 offset = sin(color.xy) / cos(dist / u_resolution.x);
  vec4 distorted_img = texture2D(image, _pos.xy * offset);
  vec4 blurred_img = blur9(image, _pos.xy * offset, u_resolution.xy, vec2(1.2));

  gl_FragColor = vec4(distorted_img);
}
