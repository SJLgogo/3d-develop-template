#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"
#iChannel1 "https://s2.loli.net/2023/09/10/Jb8mIhZMBElPiuC.jpg"
#iChannel2 "https://s2.loli.net/2023/07/17/3GDlwcvehqQjTPH.jpg"


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

vec4 transition(vec2 uv){
    float progress=iMouse.x/iResolution.x;
    float ratio=iResolution.x/iResolution.y;
    vec2 dispVec=texture(iChannel2,uv).xy;
    
    // vec2 uv1=vec2(uv.x-dispVec.x*progress,uv.y);
    // vec2 uv2=vec2(uv.x+dispVec.x*(1.-progress),uv.y);

    float strength=.6;
    vec2 uv1=vec2(uv.x-dispVec.x*progress*strength,uv.y);
    vec2 uv2=vec2(uv.x+dispVec.x*(1.-progress)*strength,uv.y);

    return mix(getFromColor(uv1),getToColor(uv2),progress);
}


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy ;
    vec4 col = transition(uv);
    gl_FragColor = vec4(col);
}