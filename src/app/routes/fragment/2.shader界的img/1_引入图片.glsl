#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

// 扭曲函数 
vec2 distort(vec2 p){
    p.x+=sin(p.y*10.+iTime)/50.;
    return p;
}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = distort(uv);
    vec3 tex=texture(iChannel0,uv).xyz;
    gl_FragColor=vec4(tex,1.);
}