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
  v_uv = position.xy;

  float t = time / 2.0 - u_column / 10.0;

  vec2 r = vec2(0);
  r.x = fbm(vec2(u_column + t, u_row) + vec2(vec2(u_column, u_row)));
  r.y = fbm(vec2(u_column, u_row + t) + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((vec2(u_column, u_row) + r));
  s.y = fbm(vec2(u_column, u_row) + r);

  v_noise = vec3(r.x, s.xy);

  // pos = rotateX(DEG_TO_RAD + t) * pos;
  // pos = rotateZ(DEG_TO_RAD + (v_noise.z / 4.0) - t) * pos;
  // pos = rotateY(v_noise.y * t * DEG_TO_RAD) * pos;

  pos.x += u_column * 2.0 - u_total_columns;
  pos.y -= (u_row - (u_total_rows / 2.0) - .5) * (sin(t) + 1.0) / 20.0;
  // pos.y -= .25;

  // pos.z -= v_noise.z * 4.0;

  // pos.y -= 20.0;
  // pos.z -= 10.0;

  // pos += mod((v_noise - .1) * (t * 30.0), 50.0);

  // pos.y -= 10.0;


  pos = rotateX(DEG_TO_RAD + t) * pos;
  // pos = rotateZ(DEG_TO_RAD + t) * pos;
  pos = rotateY(DEG_TO_RAD * v_noise.y) * pos;

  // pos.x += t;
  // pos.x += (mod(time, 10.0) / (u_column / 3.0)) * 3.0;
  // pos.z += s.x;

  pos *= 3.0;
  pos.x += 3.0;
  float y = pos.y - (u_column - u_total_rows / 2.0) + (u_row - u_total_rows / 2.0);

  mat4 what = mat4(
    1, 0, 0, 0,
    0, sin(y), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );

  gl_PointSize = 5.0;
  gl_Position = projection * view * what * vec4(pos.zyx, 1);
}
