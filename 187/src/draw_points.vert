precision highp float;

attribute vec2 xy;
uniform float time;
uniform vec2 u_resolution;
uniform mat4 projection, view;
varying vec3 pos;
varying vec2 vUv;
varying vec3 _color;

#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

const float DEG_TO_RAD = 3.141592653589793 / 180.0;

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
  vUv = xy;
  vec2 xy = vUv.xy - 2.0;
  float t = time / 2.0;


  vec2 r = vec2(0);
  r.x = fbm(xy / 10.0 + vec2(t / (xy.xy * -10.0)));
  r.y = fbm(xy / 10.0 + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((xy + r) + t / 10.0);
  s.y = fbm(xy + r + fbm(t / -s));

  // vec3 color = vec3(s, r.x);
  vec3 color = vec3(r.yx, s.x) * 20.0;

  vec3 light = vec3((sin(t / 100.0) + 2.0) / 10.0, (cos(t / 100.0) + 2.0) / 10.0, (sin(t / 100.0) + 2.0) / 10.0);
  // vec3 light = vec3(1.);

  pos = vec3(vUv.x - 52.0, vUv.y - 34.0, 0.0);
  pos = rotateX(90.0 * DEG_TO_RAD) * pos;

  _color = vec3(dot(color.x, light.x), dot(color.y, light.y), dot(color.z / 1.0, light.z));
  _color = vec3(dot(color.x, _color.x), dot(color.y, _color.y), dot(color.z / 1.0, _color.z));

  // gl_Position = projection * view * vec4(color, 1.0);
  gl_Position = projection * view * vec4(pos, 1);
  gl_PointSize = 3.0;
}
