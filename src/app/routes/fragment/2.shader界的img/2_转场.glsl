#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"
#iChannel1 "https://s2.loli.net/2023/09/10/Jb8mIhZMBElPiuC.jpg"
#define mix(x,y,t) x*(1.-t)+y*t

float sdCircle(vec2 p,float r)
{
    return length(p)-r;
}


// 返回两种图片的纹理
vec4 getFromColor(vec2 uv){
    return texture(iChannel0,uv);
}

vec4 getToColor(vec2 uv){
    return texture(iChannel1,uv);
}

// 转场函数将 2 张纹理通过mix函数混合了起来，并且混合程度是用户鼠标归一化后的x轴位置。
vec4 transition(vec2 uv){
    float progress = iMouse.x/iResolution.x;
    return mix(getFromColor(uv),getToColor(uv),progress);   
}

// 滑动转场
vec4 transition2(vec2 uv){
    float progress=iMouse.x/iResolution.x;
    return mix(getFromColor(uv),getToColor(uv),1.-step(progress,uv.x));
}


// 遮罩转场
vec4 transition3(vec2 uv){
    float progress=iMouse.x/iResolution.x;
    float ratio=iResolution.x/iResolution.y;  // 画布比例

    vec2 p = uv;
    p-=.5;
    p.x*=ratio;
    float d=sdCircle(p,progress*sqrt(2.));
    float c=smoothstep(0.,.02,d);
    return mix(getFromColor(uv),getToColor(uv),1.-c);
}



void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 col=transition3(uv);
    gl_FragColor = vec4(uv);
}