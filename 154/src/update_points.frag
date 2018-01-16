precision highp float;

varying vec4 _pos;
varying vec2 vUv;
uniform float time;
uniform sampler2D position;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform vec2 u_offset;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
  // Initial values
  float value = 0.0;
  float amplitud = .1;
  float frequency = 0.05;
  //
  // Loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
      value += amplitud * noise(st);
      st *= 1.5;
      amplitud *= .7;
  }
  return value;
}

void main () {
  vec2 _uv = 1.0 + 2.0 * vUv;
  vec3 _pos = vec3(_uv.x, 0.0, _uv.y);

  _pos.y -= fbm((_uv.xy) + u_offset) * 4.0 - .4;

  // _pos.xyz -= vec3(2.0, 0.0, 0.0);


  gl_FragColor = vec4(_pos, 1.0);
}