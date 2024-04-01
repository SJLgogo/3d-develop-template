void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = (uv-.5)*2.;  // uv坐标居中
    uv.x*=iResolution.x/iResolution.y; // 画布比例1:1
    float d= length(uv);
    d-=.1;
    float c= 0.;
    /** 
    等于step代码
    if(d>.1){
        c=1.;
    }else{
        c=0.;
    };
    **/
    c = step(0.,d);   
    // c = smoothstep(0.,.1,d);  // 抗锯齿 || 模糊效果
    gl_FragColor = vec4(vec3(c),1.);
}


