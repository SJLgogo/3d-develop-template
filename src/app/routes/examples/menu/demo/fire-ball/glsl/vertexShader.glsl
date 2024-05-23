
attribute float size;


void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 5.;
  gl_PointSize = size * (1000.0 / length(mvPosition.xyz));
}
