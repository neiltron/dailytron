precision mediump float;

varying vec2 uv;
uniform sampler2D src;
uniform float time;

void main () {
  vec3 pos = texture2D(src, uv).xyz;

  pos.z = (sin((pos.x / 10.0) + time) * cos((pos.y / 10.0) + time)) * 2.0;

  gl_FragColor = vec4(pos, 1);
}