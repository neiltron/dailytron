precision highp float;

uniform float time;
uniform float u_pixel_ratio;
uniform float u_offset;
uniform float u_column;
uniform float u_row;
uniform vec2 u_resolution;

varying vec3 _color;
varying vec3 pos;
varying vec2 v_uv;


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

void main() {
  vec3 _pos = pos;
  vec2 xy = pos.xy;

  vec2 r = vec2(0);
  r.x = fbm(xy / 10.0 + vec2(xy.xy * -10.0));
  r.y = fbm(xy / 10.0 + 1.0) * 1.2;

  vec2 s = vec2(0);
  s.x = fbm((xy + r));
  s.y = fbm(xy + r);

  vec3 black = vec3(0.1, .4, 0.12);
  vec3 green = vec3(0.2, .6, 0.2);

  // vec3 _color = mix(black, green, v_uv.y);
  vec3 _color = green;
  _color -= pos.x * v_uv.y;
  _color -= max(0.0, .3 - ((pos.x) / 40.0));
  // _color -= .1;

  // float color = 1.0 - min(.6, distance(v_uv.y + .5, mod(time, u_column)) * 10.0);
  // color -= v_uv.x * 10.0;
  // color += pos.y;
  float alpha = 1.0;

  gl_FragColor = vec4(_color, alpha);
}
