// clang-format off
#pragma glslify: noise = require(glsl-noise/simplex/3d)
// clang-format on

varying vec3 vPosition;
uniform vec3 color;
uniform float time;
uniform vec3 points[POINT_COUNT];
void main() {
  float dist = 1000.0;
  for (int i = 0; i < POINT_COUNT; i++) {
    vec3 point = points[i];
    float curDist = distance(vPosition, point);
    dist = min(curDist, dist);
  }
  float inside = dist < 0.15 ? 1.0 : 0.0;
  float alpha = dist < 0.15 ? 0.0 : 1.0;
  vec3 fragColor = mix(color, vec3(1.0), inside);

  gl_FragColor = vec4(fragColor, alpha);
}