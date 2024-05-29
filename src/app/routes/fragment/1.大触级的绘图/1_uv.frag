void main() {
    //用输入坐标fragCoord除以画布大小iResolution.xy，我们就能得到一个归一化的坐标
    vec2 uv = gl_FragCoord.xy / iResolution.xy; 
    // gl_FragColor = vec4(uv.x,0.,0.,1.0); 
    // gl_FragColor = vec4(0.,uv.y,0.,1.0); 
    gl_FragColor = vec4(uv,0.,1.0); 
}