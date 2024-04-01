
// 并
float opUnion(float d1,float d2)
{
    return min(d1,d2);
}

// 交
float opIntersection(float d1,float d2)
{
    return max(d1,d2);
}

// 差
float opSubtraction(float d1,float d2)
{
    return max(-d1,d2);
}


// 平滑版:

// 并
float opSmoothUnion(float d1,float d2,float k){
    float h=clamp(.5+.5*(d2-d1)/k,0.,1.);
    return mix(d2,d1,h)-k*h*(1.-h);
}

// 交
float opSmoothSubtraction(float d1,float d2,float k){
    float h=clamp(.5-.5*(d2+d1)/k,0.,1.);
    return mix(d2,-d1,h)+k*h*(1.-h);
}

// 差

float opSmoothIntersection(float d1,float d2,float k){
    float h=clamp(.5-.5*(d2-d1)/k,0.,1.);
    return mix(d2,d1,h)+k*h*(1.-h);
}


// 长方形函数
float sdBox(in vec2 p,in vec2 b)
{
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}


float sdCircle(vec2 p,float r)
{
    return length(p)-r;
}


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
    uv = (uv-.5)*2.;
    uv.x*=iResolution.x/iResolution.y;

    float d1= sdCircle(uv,.5);
    float d2=sdBox(uv,vec2(.6,.3));

    float c= opUnion(d1,d2);

    c= opIntersection(d1,d2);

    c=opSubtraction(d1,d2);
    c = smoothstep(0.,0.002,c);
    

    gl_FragColor=vec4(vec3(c),1.);
    
}