struct Ray {
    vec3 origin;    // 射线的起点
    vec3 direction; // 射线的方向
};

Ray GetRay(vec2 uv , vec3 camPos , vec3 lookat , float zoom){
    
    Ray a;

    a.origin = camPos;

    vec3 f = normalize(camPos-lookat);  // 相机位置到查看位置的归一化向量
    vec3 r = cross(vec3(0.,1.,0.) , f);  // 计算相机右侧方向
    vec3 u = cross(f , r);  // 计算相机上侧方向
    vec3 c = a.origin + f*zoom;
    vec3 i = c + uv.x * r + uv.y*u ;

    a.direction = normalize(i-a.origin);

    return a;
}



void main(){

    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    uv -=.5;

    uv.x *= iResolution.x / iResolution.y;  // 画布比例 1: 1

    vec3 camPos = vec3(0 , .2, 0);  // 相机坐标
    vec3 lookat = vec3(0 , .2, 1.); // 看向坐标


    gl_FragColor = vec4(uv,0.5+0.5*sin(iTime),1.);
}