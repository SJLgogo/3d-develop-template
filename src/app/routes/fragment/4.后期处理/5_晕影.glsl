#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec3 tex = texture(iChannel0 ,uv).xyz;
    uv-=.5;
    float d = length(uv);
    
    // float c=smoothstep(.4,.8,d);
    float c=smoothstep(.8,.4,d);

    vec3 col=tex;
    col*=c;

    gl_FragColor = vec4(vec3(col),1.);
}
