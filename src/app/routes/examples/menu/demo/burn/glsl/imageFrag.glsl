
uniform sampler2D noiseTex;
uniform sampler2D imgPrevTex;
uniform sampler2D imgNextTex;
uniform vec2 imgRatio;
uniform float time;
uniform float easeTransition;

varying vec2 vUpdateUv;
varying float vTime;
varying vec2 vUv;

/** 燃烧实现 */
void main(){
    
    vec2 ratio=vec2(
        min(imgRatio.x/imgRatio.y/3.*2.,1.),
        min(imgRatio.y/imgRatio.x/2.*3.,1.)/3.*2.
    );
    vec2 imgUv=vec2(
        vUv.x*ratio.x+(1.-ratio.x)*.5,
        vUv.y*ratio.y+(1.-ratio.y)*.5
    );
    
    float noiseR=texture2D(noiseTex,vUpdateUv+vec2(time*.1,0.)).r;
    float noiseG=texture2D(noiseTex,vUpdateUv+vec2(time*.2,0.)).g;
    float slide=texture2D(noiseTex,vUv*vec2(.998)+.001).b;
    
    float mask=vTime*1.24-(slide*.6+noiseR*.2+noiseG*.2);
    float maskPrev=1.-smoothstep(.12,.16,mask);
    float maskNext=smoothstep(.16,.2,mask);
    float maskEdge=smoothstep(.04,.12,mask)*(1.-smoothstep(.2,.28,mask));
    
    vec4 imgPrev=texture2D(imgPrevTex,imgUv*(.95-.05*easeTransition)+.025+.025*easeTransition);
    vec4 imgNext=texture2D(imgNextTex,imgUv*(1.-.05*easeTransition)+.025*easeTransition);
    
    // 0.9 - 0.8
    // 1.0 - 0.9
    
    vec3 color1=imgPrev.rgb*maskPrev;
    vec3 color2=imgNext.rgb*maskNext;
    vec3 color3=vec3(0.,.2,1.)*maskEdge;
    
    gl_FragColor=vec4(color1+color2-color3,1.);
    
}


/** 实现 */
// void main(){
    
    //     float noiseR=texture2D(noiseTex,vUpdateUv+vec2(time*.1,0.)).r;
    //     float noiseG=texture2D(noiseTex,vUpdateUv+vec2(time*.2,0.)).g;
    //     float slide=texture2D(noiseTex,vUv*vec2(.998)+.001).b;
    
    //     float mask=vTime*1.24-(slide*.6+noiseR*.2+noiseG*.2);
    //     float maskPrev=1.-smoothstep(.12,.16,mask);
    
    //     vec4 imgPrev=texture2D(imgPrevTex,vUpdateUv);
    //     vec4 imgNext=texture2D(imgNextTex,vUpdateUv);
    
    //     vec3 color1=imgPrev.rgb*maskPrev;
    //     vec3 color2=imgNext.rgb;
    
    //     gl_FragColor=vec4(color1,1.);
// }
