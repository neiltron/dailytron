precision mediump float;


attribute vec2 position;
uniform mat4 projection, view;
uniform float time;
uniform float u_zindex;
uniform float u_index;
uniform vec2 u_mousepos;
uniform vec2 u_resolution;
uniform float u_circle_count;
varying vec2 pos;
varying float circleNum;

void main () {
  pos = position;
  vec2 mouseOffset = (u_resolution.xy / 2.0) - u_mousepos.xy / u_index;
  float dist = distance(u_resolution.xy / 2.0, pos.xy * u_resolution.xy);

  // pos.x = 1.0 - 2.0 * pos.x - u_index * .01 * sin(time);
  // pos.y = 1.0 - 2.0 * pos.y - u_index * .01 * cos(time);

  vec3 _pos;
  _pos.z = u_index - mod(time * 2.0, 2.0) - 2.0;

  circleNum = (u_circle_count - u_index);


  // _pos.x = 1.0 - 2.0 * ((pos.x - ((10.0 - u_index / 10.0) * sin(time + u_index) / 30.0)) * (u_index / 10.0));
  // _pos.y = 1.0 - 2.0 * ((pos.y - ((10.0 - u_index / 10.0) * cos(time + u_index) / 30.0)) * (u_index / 10.0));

  // _pos.x = 1.0 - 2.0 * pos.x + sin(time) / (10.0 * (u_circle_count - u_index)) * (u_resolution.x / u_mousepos.x);
  // _pos.y = 1.0 - 2.0 * pos.y + cos(time) / (10.0 * (u_circle_count - u_index)) * (u_resolution.y / u_mousepos.y);

  _pos.x = 1.0 - 2.0 * pos.x;
  _pos.y = 1.0 - 2.0 * pos.y;

  gl_Position = projection * view * vec4(_pos.xy, u_zindex, 1.0) * vec4(-1.0, 1.0, -1.0, 1.0);
}
