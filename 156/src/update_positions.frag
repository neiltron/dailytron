precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform float time;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;

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
  vec4 _pos = texture2D(src, uv);

  _pos.xyz *= sign(vec3(10.0) - _pos.xyz);

  // _pos.x -= .9 * fbm((gl_FragCoord.xy / u_resolution.xy) * (distance(abs(_pos.x), 50.0)) * .5);
  // _pos.z -= .95 * fbm((gl_FragCoord.xy / u_resolution.xy) * (distance(abs(_pos.z), 50.0)) * .5);
  // _pos.y -= .9 * fbm((gl_FragCoord.xy / u_resolution.xy) * (distance(abs(_pos.z), 50.0)) * .5);

  float factor = 5.0;
  float limiter = time / 20.0 + 100.;

  _pos.x = 3.0 + (.3 * (fbm(((mod((gl_FragCoord.xy / u_resolution.xy) / 10.0, 2.0) + .5) * (_pos.x + smoothstep(.1, 5.0, time / 20.0)))) * .1)) * limiter * factor;
  _pos.y = 3.0 + (.35 * (fbm(((mod((gl_FragCoord.xy / u_resolution.xy) / 10.0, 2.0) + .5) * (_pos.x + smoothstep(.1, 5.0, time / 20.0)))) * (distance(abs(_pos.z), 50.0)) * .04)) * smoothstep(0.2, .9, limiter) * factor;
  // _pos.y = 3.0 + (.3 * (fbm((mod(distance(_pos.xy, vec2(0.0, 0.0)) / u_resolution.xy, 5.0) * (_pos.y + smoothstep(.1, 200.0, time / 50.0))) / 1.0) * (distance(abs(_pos.y), 50.0)) * .05)) * limiter * factor;
  _pos.z = 3.0 + (.35 * (fbm(((mod((gl_FragCoord.xy / u_resolution.xy) / 10.0, 2.0) + .5) * (_pos.x + smoothstep(.1, 5.0, time / 20.0)))) * (distance(abs(_pos.z), 50.0)) * .04)) * smoothstep(0.2, .9, limiter) * factor;

  _pos.xyz = sin(mod(_pos.xyz, 10.0));

  gl_FragColor = vec4(_pos.xyz, 1.0);
}