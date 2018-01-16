precision highp float;

attribute vec3 xy;
uniform float time;
uniform float u_radius;
uniform float u_step;
uniform float u_stepTime;
uniform float u_z, u_turbulence, u_offset;
uniform bool u_transformX, u_transformY, u_transformZ;
uniform vec2 u_resolution;
uniform mat4 projection, view;
varying vec4 pos;
varying vec3 vUv;

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
  vec3 xy = vUv.xyz - 2.0;
  // xy = (mod(xy + (vUv), .5) + .5) / 5.0;


  vec2 r = vec2(0);
  r.x = fbm(xy.xy + vec2(time / (xy.xy * -1000.0)));
  r.y = fbm(xy.xy + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((xy.xy + r) + (time / 10000.0 * u_turbulence));
  s.y = fbm(xy.xy + r + fbm(time / -s) / 100.0);

  // vec3 color = vec3(s, r.x);
  vec3 color = vec3(r.yx, s.x) * u_turbulence;

  pos = vec4(sin(vUv.y) + cos(vUv.x), cos(vUv.y) + sin(vUv.x), 9.9 + step(40.0, vUv.y + vUv.x) * 100.0, 1);

  // float percentage = min(1.0, (time - u_stepTime) / 50.0);
  // pos.z = mix((u_step - 1.0) * -5.0, u_step * -5.0, percentage) * 20.0;

  float percentage = min(1.0, ((time - u_stepTime) / 100.0));
  // pos.z -= ((max(0.0, u_step - 1.0)) * 5.0) + percentage * u_step * 5.0;

  pos.xy = vUv.xy - vec2(0, 2);
  pos.z = vUv.z;

  float angle = (pos.z) / u_radius;
  pos.y = sin(2.0 * 3.14 * angle) + sin(pos.x + u_offset * 4.0);
  pos.z = cos(2.0 * 3.14 * angle) + cos(pos.x + u_offset * 4.0);
  pos.x += (u_offset * 4.0) - 20.0;


  if (u_transformY) {
    pos.y *= color.z;
  }
  if (u_transformZ) {
    pos.z *= color.z;
  }

  // pos.x += 20.0 + ((sin(time / 50.0) + 1.0)) * 4.0;

  // pos.x = step(.2, vUv.y) * vUv.z - 500.0;

  // gl_Position = projection * view * vec4(color, 1.0);
  gl_Position = projection * view * pos;
  gl_PointSize = 3.0;
}
