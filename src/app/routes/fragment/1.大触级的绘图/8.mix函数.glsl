#define mix(x,y,t) x*(1.-t)+y*t  // 混合函数

float sdCircle(vec2 p,float r)
{
    return length(p)-r;
}


// 长方形函数
float sdBox(in vec2 p,in vec2 b)
{
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}




void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = (uv-.5)*2.;
    uv.x*=iResolution.x/iResolution.y;

    vec3 col1=vec3(0.3216, 0.1922, 0.1922);
    vec3 col2=vec3(0.0392, 0.0706, 0.0863);
    vec3 col=mix(col1,col2,uv.x);


    // 图形染色
    float d= sdCircle(uv , .4);
    float c = smoothstep(0.,0.02,d);
    col = mix(col1,col2,c);
    gl_FragColor=vec4(col,1.);


    // 形状变换
    float d1=sdCircle(uv,.5);
    float d2=sdBox(uv,vec2(.6,.3));
    d=mix(d1,d2,abs(sin(iTime)));
    c= smoothstep(0.,.002,d);
    gl_FragColor=vec4(vec3(c),1.);


}