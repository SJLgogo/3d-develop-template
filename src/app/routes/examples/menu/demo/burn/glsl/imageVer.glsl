

varying vec2 vUv;
varying vec2 vUpdateUv;
varying float vTime;

uniform float easeTransition;
uniform float time;
uniform sampler2D noiseTex;
uniform sampler2D imgPrevTex;
uniform sampler2D imgNextTex;
uniform vec2 imgRatio;



void main(){

   vec2 updateUv = uv * imgRatio + vec2(
      (1.0 - imgRatio.x) *0.5,
      (1.0 - imgRatio.y) *0.5
   );


   // 波浪
   float slide=texture2D(noiseTex,uv*vec2(.998)+.001).b;
   float mask=easeTransition*1.6-slide;
   float maskPrev=smoothstep(0.,.3,mask);
   float maskNext=1.-smoothstep(.3,.6,mask);
   float height=maskPrev*maskNext*4.;

   vUv=uv;
   vUpdateUv = updateUv;
   vTime = easeTransition;

   gl_Position=projectionMatrix*modelViewMatrix*vec4(position+vec3(0,0,height),1.);
}