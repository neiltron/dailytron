precision highp float;

attribute vec3 position;
// attribute vec2 uv;
// attribute vec3 normal;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform float time;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
uniform float u_total_columns;
uniform float u_total_rows;
varying vec3 v_noise;
varying vec2 v_uv;

varying vec3 pos;

#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)

const float PI = 3.141592653589793;
const float DEG_TO_RAD = PI / 180.0;

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
  pos = position;
  v_uv = position.xx;

  vec2 r = vec2(0);
  r.x = fbm(vec2(u_column, u_row) / 100.0 + vec2(vec2(u_column, u_row)));
  r.y = fbm(vec2(u_column, u_row) / 100.0 + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((vec2(u_column, u_row) + r));
  s.y = fbm(vec2(u_column, u_row) + r);

  v_noise = vec3(r.x, s.xy);

  float t = time / 2.0 - u_column / 10.0;

  pos = rotateX(DEG_TO_RAD + (v_noise.x / 4.0) - sin(t) / 20.0) * pos;
  pos = rotateZ(DEG_TO_RAD + (v_noise.z / 4.0) - sin(t) / 20.0) * pos;
  pos = rotateY((v_noise.y + 80.0) * DEG_TO_RAD) * pos;

  pos.z += u_column / 12.0;
  pos.x -= u_row / 12.0;
  pos.z += s.x;
  // pos.y += s.y / 1.0;

  pos.x += 4.;
  pos.y -= 1.;
  pos.z -= 8.8;

  gl_PointSize = 1.0;
  gl_Position = projection * view * vec4(pos, 1);
}
