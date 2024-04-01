#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"
#iChannel1 "https://s2.loli.net/2023/09/10/Jb8mIhZMBElPiuC.jpg"
#define mix(x,y,t) x*(1.-t)+y*t


// 返回两种图片的纹理
vec4 getFromColor(vec2 uv){
    return texture(iChannel0,uv);
}

vec4 getToColor(vec2 uv){
    return texture(iChannel1,uv);
}

vec4 transition(vec2 uv){
    float progress=iMouse.x/iResolution.x;
    return mix(getFromColor(uv),getToColor(uv),progress);
}


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    gl_FragColor = transition(uv);
}