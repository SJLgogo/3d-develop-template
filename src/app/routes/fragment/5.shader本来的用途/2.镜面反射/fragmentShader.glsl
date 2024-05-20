varying vec2 vUv;
varying vec3 vNormal;// 法向量
varying vec3 vWorldPosition;// 片元位置

void main(){

    vec3 col = vec3(0.);
    vec3 objectColor = vec3(1.);
    vec3 lightColor = vec3(0.5608, 0.0941, 0.0941);

    

    gl_FragColor = vec4(col,1.);

}