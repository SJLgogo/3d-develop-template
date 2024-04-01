void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy; 
    // gl_FragColor = vec4(uv.x,0.,0.,1.0); 
    // gl_FragColor = vec4(0.,uv.y,0.,1.0); 
    gl_FragColor = vec4(uv,0.,1.0); 
}