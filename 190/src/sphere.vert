precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
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
varying vec3 v_normal;
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
  v_uv = uv;
  v_normal = normal;
  vec2 xy = v_uv.xy - 2.0;
  // xy = (mod(xy + (vUv), .5) + .5) / 5.0;
  float t = time - u_offset / 10.0;


  vec2 r = vec2(0);
  r.x = fbm(xy / 100.0 + vec2(t / (xy.xy * -10.0)) + u_column);
  r.y = fbm(xy / 100.0 + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((xy + r) + t / 10.0);
  s.y = fbm(xy + r + fbm(t / -s));

  // vec3 color = vec3(s, r.x);
  vec3 color = vec3(r.yx, s.x) * 20.0;

  vec3 light = vec3((sin(t / 100.0) + 2.0) / 10.0, (cos(t / 100.0) + 2.0) / 10.0, (sin(t / 100.0) + 2.0) / 10.0);
  // vec3 light = vec3(1.);


  _color = vec3(dot(color.x, light.x), dot(color.y, light.y), dot(color.z / 1.0, light.z));
  _color = vec3(dot(color.x, _color.x), dot(color.y, _color.y), dot(color.z / 1.0, _color.z));

 //   pos = rotateZ(time + u_row / 10.0) * pos;
  // pos = rotateY(time / 3.0 + u_row / 10.0) * pos;

  pos.x -= u_offset / 20.0;
  // pos.y += u_column / 10.0 + 26.0;
  pos.z -= u_row * 7.0 - 14.0;
  // pos.x -= 4.0;
  // pos.z -= 30.0;
  // pos.y += 5.0;

  // pos.y /= u_amplitude;
  // pos.y /= max(min((sin(time / 2.0) + 1.0), 4.0), .2);

  // pos = rotateZ((sin(time - u_offset / (400.0 / u_offset))) - 1.2) * pos;
  // pos = rotateZ((u_mousepos.y - u_resolution.y / 2.0) / u_resolution.y / 8.0) * pos;
  // pos = rotateX((u_mousepos.x - u_resolution.x / 2.0) / u_resolution.x / 8.0) * pos;
  pos = rotateY(90.0 * DEG_TO_RAD + u_row / u_column) * pos;

  pos = normal * (pos / vec3(1.0, (.2 + (sin(u_column + u_row) / 10.0)) + ((sin(_color.z) + 1.0) / 10.0), 1.0));

  pos.z += u_column / 1.0 - 1.5;
  pos.x -= u_row * 7.0 - 2.0;
  pos.y -= 2.0;


  gl_PointSize = 1.0;
  gl_Position = projection * view * vec4(pos, 1);
}
