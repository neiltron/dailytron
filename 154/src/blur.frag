precision highp float;

varying vec2 uv;
uniform sampler2D src;
uniform sampler2D sphereSrc;
uniform float time;


void main () {
  vec4 sum = vec4(0);
  vec2 texcoord = uv;

  vec4 sampleColor = texture2D(src, texcoord);
  vec4 sphereColor = texture2D(sphereSrc, texcoord);

  vec4 color;

  for (int i = -4; i < 4; i++) {
    for (int j = -3; j < 3; j++) {
      sum += texture2D(src, texcoord + vec2(j, i) * 0.004) * 0.25;
    }
  }

  if (sampleColor.r > 0.7) {
    color = (sum * sum * 0.012 + sampleColor) * sampleColor.a;
  } else {
    if (sampleColor.r > 0.5) {
      color = (sum * sum * 0.009 + sampleColor) * sampleColor.a;
    } else {
      color = (sum * sum * 0.0075 + sampleColor) * sampleColor.a;
    }
  }

  gl_FragColor = color + sphereColor;
}