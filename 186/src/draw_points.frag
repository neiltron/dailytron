precision highp float;

uniform float time;
uniform float u_scroll_pos;
uniform float u_amplitude;
uniform float u_pixel_ratio;
uniform bool u_lines;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
varying vec4 pos;
varying vec2 vUv;
varying vec3 _color;


void main () {
  // float alpha = (pos.y - pos.x) / 2.0;
  float alpha = 1.0;
  float blue = sin(pos.z / 8.0 * mod(pos.z, 1.) + (time / 80.0)) + 1.0;

  float amplitude = ((sin(time / 100.0) + 1.0) / 10.) + .2;

  vec2 coords = (2.0 - u_pixel_ratio + 1.0) * ((gl_FragCoord.xy * 1.5) / u_resolution.xy) + vec2(-0.7, -0.0);
  vec2 adjusted = coords.xy * ((_color.xy / 10.0) * vec2(-1.0, -u_amplitude));



  vec4 color = texture2D(u_texture, mix(coords, adjusted, amplitude));

  if (color.rgb == vec3(1)) {
    color.rgb = vec3(0);
  }

  gl_FragColor = u_lines ? vec4(vec3(.3), .5) : vec4(color.xyz, 1.0);

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}