precision highp float;

attribute vec3 position;
// attribute vec2 uv;
// attribute vec3 normal;
uniform mat4 projection, view;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform float time;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
uniform float u_total_columns;
uniform float u_total_rows;
varying vec3 v_noise;
varying vec2 v_uv;
varying vec3 pos;

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

  float t = time / 2.0;

  v_noise.x = fbm(
    vec2(u_column / 100.0 - (t / 10.0), u_row / 100.0 - (t / 10.0))
  );
  v_noise.y = fbm(vec2(u_column / 100.0 - (t / 10.0), u_row / 100.0 - (t / 10.0)) + 1.0) * 1.2;
  v_noise.z = fbm(vec2(u_column / 100.0, u_row / 100.0) + v_noise.xy);

  pos = rotateY(45.0 * DEG_TO_RAD) * pos;

  pos.x += u_column * 1.4 - u_total_columns / 1.425;
  pos.z += u_row * 1.4 - u_total_rows / 1.45;
  pos.y *= v_noise.x * 80.0;

  vec2 mouse = (u_mousepos / u_resolution);
  mouse.y = (mouse.y - .5);
  mouse.x = 1.0 - mouse.x * 2.0;
  pos.y += 2.0 * (1.0 - max(1.0, distance( pos.xz / vec2(u_total_rows, u_total_columns),  mouse) * 50.0));

  // pos.z += mod(time * 3.0, 10.0);

  pos *= 2.0;


  gl_PointSize = 5.0;
  gl_Position = projection * view * vec4(pos.zyx, 1);
}
