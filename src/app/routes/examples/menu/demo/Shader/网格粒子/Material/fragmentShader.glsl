varying vec2 vUv;


uniform float iTime;

void main(){

    vec2 uv = vUv ;

    gl_FragColor = vec4(uv,0.,1.);

}