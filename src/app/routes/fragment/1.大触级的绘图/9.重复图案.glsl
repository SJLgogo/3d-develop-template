void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = (uv-.5)*2.;
    uv.x*=iResolution.x/iResolution.y;
    uv=fract(uv*16.);
    vec3 c=vec3(step(0.4,uv.x));
    c=vec3(step(0.4,uv.y));
    gl_FragColor=vec4(c,1.);
    
}