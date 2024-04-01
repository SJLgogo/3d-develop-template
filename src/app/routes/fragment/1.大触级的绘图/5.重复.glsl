
// 等边三角形
float  sdEquilateralTriangle(in vec2 p,in float r)
{
    const float k=sqrt(3.);
    p.x=abs(p.x)-r;
    p.y=p.y+r/k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.*r,0.);
    return-length(p)*sign(p.y);
}


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv=fract(uv*vec2(2.,2.));
    uv=(uv-.5)*2.;
    uv.y=abs(uv.y);  // 镜像 , abs取一个数的绝对值
    uv.x*=iResolution.x/iResolution.y;

    float d = sdEquilateralTriangle(uv , .5);
    float c = smoothstep(0.,0.02,d);

    gl_FragColor = vec4(uv,0.,1);

    gl_FragColor = vec4(vec3(c),1.);
}