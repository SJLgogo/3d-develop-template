#iChannel0 "https://s2.loli.net/2023/09/10/63quVIA9xZLksDc.jpg"


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
    vec2 uv =gl_FragCoord.xy / iResolution.xy ;
    /** 噪音 */
    // float noise=random(uv)*.5+.5;
    // vec2 offset=.0125*vec2(cos(noise),sin(noise));

    float offset=.0025;

    vec2 ruv = uv;
    vec2 guv = uv;
    vec2 buv = uv;
    ruv+=offset;
    buv+=offset;


    vec4 rTex = texture(iChannel0,ruv);
    vec4 gTex = texture(iChannel0,guv);
    vec4 bTex = texture(iChannel0,buv);

    vec4 col=vec4(rTex.r,gTex.g,bTex.b,1.);

    gl_FragColor = col;
}