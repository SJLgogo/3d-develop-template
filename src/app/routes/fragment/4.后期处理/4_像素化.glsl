#iChannel0 "https://s2.loli.net/2023/09/10/63quVIA9xZLksDc.jpg"


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    // float c=uv.x;
    // c=floor(c*10.)/10.;


    vec2 size=vec2(50.,50.);
    uv=floor(uv*size)/size;
    vec3 tex=texture(iChannel0,uv).xyz;


    gl_FragColor = vec4(tex,1.);

}