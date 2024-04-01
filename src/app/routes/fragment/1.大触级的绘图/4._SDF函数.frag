
/**
    SDF 函数 : 符号距离函数
    它将空间里的一个位置作为输入，并返回该位置到给定形状的距离
*/ 
float sdCirlce( vec2 uv , float r )
{
        return length(uv) - r;
}


// 长方形函数
float sdBox(in vec2 p , in float b){
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
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


// 旋转函数
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);

    return mat2(
        c,-s,
        s,c
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}






void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy ;
    uv = (uv-.5) * 2.;
    uv.y*=-1.;    // 实现翻转
    uv=rotate(uv, iTime);
    /**     
        uv 变换
        uv.x+=.2;
        uv.y+=.4;

        简写 :  uv += vec2(.2,.4)
    
    */

    // float d = sdCirlce(uv,.5);
    // float d = sdBox(uv,.5);

    float d = sdEquilateralTriangle(uv,.5);
    float c=smoothstep(0.,.001,d);
    gl_FragColor = vec4(vec3(c),1.);
}