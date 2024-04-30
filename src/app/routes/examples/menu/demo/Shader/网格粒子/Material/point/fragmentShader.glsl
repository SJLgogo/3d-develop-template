varying vec2 vUv;

void main(){

    // vec2 uv = vUv;

    vec2 uv = gl_PointCoord;
    uv = (uv-.5)*2.;

    float d = length(uv);
    float c = .05 / d ;

    c = pow(c , 3.);

    gl_FragColor = vec4(vec3(c),1.);
}