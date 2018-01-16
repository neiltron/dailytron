precision highp float;

attribute vec2 xy;
uniform float time;
uniform vec2 u_resolution;
uniform mat4 projection, view;
varying vec4 pos;
varying vec2 vUv;

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
  // xy = (mod(xy + (vUv), .5) + .5) / 5.0;


  vec2 r = vec2(0);
  r.x = fbm(xy + vec2(time / (xy.xy * -1000.0)));
  r.y = fbm(xy + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((xy + r) + (time / 10000.0));
  s.y = fbm(xy + r + fbm(time / -s) / 100.0);

  // vec3 color = vec3(s, r.x);
  vec3 color = vec3(r.yx, s.x) * 20.0;

  pos = vec4(vUv.x - 40.0, vUv.y - 40.0, color.z * 10.0 - 30.0, 1);

  color.y -= 5.0;
  color.x -= 5.0;

  // gl_Position = projection * view * vec4(color, 1.0);
  gl_Position = projection * view * pos;
  gl_PointSize = 3.0;
}
