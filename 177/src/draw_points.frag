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
  float z = (pos.z * 100.0) * -.09;
  float blue = (sin(z / 5.0 * mod(z, 1.) + (time / 10.0)) + 1.0) / 2.0;
  float alpha = fbm(vec2(distance(pos.x / 10.0, cos(time / 200.0) * 4.0), distance(pos.y / 10.0, sin(time / 200.0) * 4.0)));

  vec3 _vUv = vUv + vec3(10.0, 5, -12);

  vec4 color = vec4(
    dot(pos.xyz, _vUv.xyz * sin(time / 160.0)),
    dot(pos.xyz, _vUv.xyz * sin(time / 160.0 + .02)),
    dot(pos.xyz, _vUv.xyz * sin(time / 160.0 + .04)),
    .9
  );

  gl_FragColor = color;

  // gl_FragColor = vec4((cos(vUv.xy + time / 10.0) + 1.0) / 2.0 + .1, (cos(pos.x * pos.y / 100.0) + 1.0), alpha);
}