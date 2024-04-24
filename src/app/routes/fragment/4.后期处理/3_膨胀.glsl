#iChannel0 "https://s2.loli.net/2023/09/10/63quVIA9xZLksDc.jpg"

vec2 bugle(vec2 p){
    p-=vec2(.5);

    float d = length(p);

    p=p*d;

    p+=vec2(.5);

    return p;
}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    uv = bugle(uv);

    vec4 tex = texture(iChannel0 , uv);

    vec3 col = texture(iChannel0,uv).xyz;


    gl_FragColor = vec4(col,1.);
}