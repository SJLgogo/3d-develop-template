
varying float vIntensity;
varying vec2 vUv;

uniform float uThickneww;


void main(){

    /** 物体顶点的世界坐标  */
    vec4 worldPosition = modelMatrix * vec4(position ,1.0);

    /** 顶点的法向向量 */
    vec3 worldNormal = normalize(modelMatrix * vec4(normal,0.0)).xyz;

    /** 顶点到摄像机的向量 */
    vec3 dirToCamera = normalize(cameraPosition - worldNormal).xyz;

    vIntensity = 1.0 - dot(worldNormal , dirToCamera);
    vIntensity = pow(vIntensity , uThickneww);

    vUv = uv;

    gl_Position=projectionMatrix * modelViewMatrix *vec4(position,1.) ;
}