precision highp float;

uniform float time;
uniform bool u_lines;
uniform vec2 u_resolution;
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
  // float alpha = (pos.y - pos.x) / 2.0;
  float alpha = 1.0;
  float z = (pos.z * 100.0) * -.09;
  float blue = (sin(z / 5.0 * mod(z, 1.) + (time / 10.0)) + 1.0) / 2.0;

  vec4 color = vec4(
    fbm(pos.xy / 5.0 + time / 120.0),
    fbm(pos.yx / 5.0 + time / 100.0),
    fbm(pos.zz / 5.0 + time / 150.0),
    1.0
  );

  gl_FragColor = u_lines ? vec4(1, 1, 1, .5) : color;

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}