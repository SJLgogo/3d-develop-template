#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy ;
    vec3 tex=texture(iChannel0,uv).xyz;

    vec3 tintColor=vec3(0.0863, 0.2549, 0.4118);
    tex*=tintColor;


    gl_FragColor=vec4(tex,1.);
}