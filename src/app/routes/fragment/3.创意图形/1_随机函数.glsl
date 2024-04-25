
#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"


// 随机函数
highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));  
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float noise=random(uv);
    vec3 col=vec3(noise);
    
    col = texture(iChannel0,uv).xyz;
    noise = random(uv-iTime);
    col += (noise-1.) / 10.;

    gl_FragColor = vec4(col,1.);
}