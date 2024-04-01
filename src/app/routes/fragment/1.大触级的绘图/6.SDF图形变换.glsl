float sdBox(in vec2 p , in float b){
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
} 

// 圆角操作
float opRound(in float d,in float r)
{
    return d-r;
}

// 镂空操作
float opOnion(in float d,in float r)
{
    return abs(d)-r;
}




void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = (uv-.5)*2.;
    float d = sdBox(uv , .5);
    d = opRound(d,0.1);
    d= opOnion(d,0.2);
    float c = smoothstep(0.,0.002,d);
    gl_FragColor =  vec4(vec3(c),1.);
}