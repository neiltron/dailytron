precision highp float;

uniform float time;
uniform vec2 u_resolution;
uniform sampler2D texture;
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
  vec2 xy = 1.0 - 2.0 * (gl_FragCoord.xy / u_resolution * 3.) - 1.0;
  xy = sin(vUv / xy);

  vec2 r = vec2(0);
  r.x = fbm(xy);
  r.y = fbm(xy + 1.0);

  vec2 s = vec2(0);
  s.x = fbm((xy + r) + (time / 1000.0));
  s.y = fbm(xy + r * fbm(time / -r));

  vec3 color = vec3(s, r.x);
  vec4 _color = texture2D(texture, vec2(vUv.x, -vUv.y) * (fbm(vUv + xy + time / 200.0) * 3.0) + vec2(.25, .5));

  gl_FragColor = vec4(_color.rgb * (color * 4.0), 1.0);
}