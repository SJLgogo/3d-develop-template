
uniform sampler2D noiseTex;
uniform sampler2D imgPrevTex;
uniform sampler2D imgNextTex;


varying vec2 vUv;

void main(){
    vec2 uv=vUv;

    vec3 tex=texture2D(imgPrevTex,uv).xyz;
    
    gl_FragColor=vec4(tex,1.);
}