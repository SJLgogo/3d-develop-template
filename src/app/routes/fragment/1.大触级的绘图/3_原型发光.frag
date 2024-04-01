void main(){
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    uv = (uv-.5)*2.; // 居中
    float d = length(uv);

    float c = .25/d;  // 取距离d的倒数，并且乘上一个比较小的值 , 类似于反比例函数
    c=pow(c,1.6);

    gl_FragColor = vec4(vec3(c),1.);    

}