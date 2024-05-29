float sdSphere(vec3 p,float r)
{
    return length(p)-r;
}


float map(vec3 p){
    float d=sdSphere(p-vec3(0.,0.,-2.),1.);
    return d;
}


void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy; 
    uv = (uv-.5)*2.;

    vec3 ro = vec3(0.,0.,1.);  // 创建一束光线
    vec3 rd = normalize(vec3(uv,0.) - ro);  // 光线的方向向量

    vec3 col=vec3(0.);  // 光线未行进时 , 输出颜色col默认是黑色


    float depth = 0.; //  



    gl_FragColor = vec4(col,1.);
}