varying vec2 vUv;
varying vec3 vNormal;// 法向量
varying vec3 vWorldPosition;// 片元位置


void main(){
    
    vUv=uv;
    // vNormal = normal;
     vNormal=(modelMatrix*vec4(normal,0.)).xyz;

    vWorldPosition=vec3(modelMatrix*vec4(position,1));
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
}