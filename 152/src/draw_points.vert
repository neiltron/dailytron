precision highp float;
#define GLSLIFY 1

attribute vec2 uv;
varying vec3 _pos;
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
      st *= 2.;
      amplitud *= .8;
  }
  return value;
}

void main () {
  // vUv = .5 * uv + .5;

  vUv = 1.0 + 2.0 * uv;

  vec2 i = floor(vUv);
  vec2 f = fract(vUv);

  vec3 _pos = vec3(vUv.x, 0.0, vUv.y);

  _pos.x -= 2.0;
  _pos.z -= 1.5;
  _pos.xz *= 10.0;
  _pos.y -= fbm(vUv.xy / 4.0 + u_offset) * 40.0 - 7.0;

  // _pos.xyz -= vec3(2.0, 0.0, 0.0);


  gl_Position = projection * view * vec4(_pos, 1.0);
  gl_PointSize = 2.;
}