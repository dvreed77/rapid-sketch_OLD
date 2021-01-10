varying vec2 vUv;

void main() {
  // Fragment shader output
  gl_FragColor = vec4(vec3(vUv.x), 1.0);
}