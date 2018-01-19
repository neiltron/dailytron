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
uniform float u_amplitude;
varying vec2 vUv;
varying vec3 _color;
// varying vec3 v_normal;
varying vec2 v_uv;

varying vec3 pos;

#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)

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
  pos = position;
  v_uv = position.xy;
  // v_uv = position.xy;
  // v_normal = normal;
  // vec2 xy = v_uv.xy - 2.0;
  // xy = (mod(xy + (vUv), .5) + .5) / 5.0;
  float t = time / 2.0 - u_column / 10.0;

  // pos = rotateZ((sin(time - u_offset / (400.0 / u_offset))) - 1.2) * pos;
  // pos = rotateZ((u_mousepos.y - u_resolution.y / 2.0) / u_resolution.y / 8.0) * pos;
  // pos = rotateX((u_mousepos.x - u_resolution.x / 2.0) / u_resolution.x / 8.0) * pos;
  // pos.y -= 2.0;
  pos = rotateX(t + 125.0 * DEG_TO_RAD + u_column + u_row) * pos;
  pos = rotateY(t + 40.0 * DEG_TO_RAD + ((u_column / u_row) / 1.5)) * pos;

  pos *= vec3(sin(position.y), sin(position.y / 2.0), 1.0);
  pos *= 5.0;

  // pos = (pos / vec3(1.0, (.2 + (sin(u_column + u_row) / 10.0)) + ((sin(_color.z) + 1.0) / 10.0), 1.0));

  // pos.z += u_column / 1.0 - 1.5;
  // pos.x -= u_row * 1.0 - 2.0;
  // pos.y -= 8.0;


  gl_PointSize = 1.0;
  gl_Position = projection * view * vec4(pos, 1);
}
