varying vec2 vUv;
varying vec3 vNormal;// 法向量
varying vec3 vWorldPosition;// 片元位置

uniform samplerCube iChannel0;

// 菲涅尔近似等式
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.-dot(I,N),power);
}

void main(){

     vec3 normal=normalize(vNormal);  // 直接用法向量normal会出现一些小问题，需要进行一定的修复

    
    vec3 col=vec3(0.);
    vec3 objectColor=vec3(1.);
    vec3 lightColor=vec3(.5608,.0941,.0941);
    
    // 环境光
    float ambIntensity=.2;
    col+=(lightColor*ambIntensity)*objectColor;
    
    // 漫反射
    vec3 lightPos=vec3(2.,3.,2.);
    vec3 lightDir=normalize(lightPos-vWorldPosition);
    float diff=dot(lightDir,normal);
    diff=max(diff,0.);
    col+=lightColor*diff*objectColor;
    
    // 镜面反射
    vec3 reflectDir=reflect(-lightDir,normal);// 反射光的方向
    vec3 viewDir=normalize(cameraPosition-vWorldPosition);
    float spec=dot(viewDir,reflectDir);
    spec=max(spec,0.);
    spec=pow(spec,20.);
    col+=lightColor*spec*objectColor;
    
    // IBL镜面反射
    float iblIntensity=.2;
    vec3 iblCoord=normalize(reflect(-viewDir,normal));// 计算反射光的方向 ,入射光方向参数是眼睛方向
    vec3 ibl=texture(iChannel0,iblCoord).xyz;
    col+=ibl*iblIntensity*objectColor;
    
    // 菲涅尔反射
    vec3 fresColor=vec3(1.);
    float fresIntensity=.6;
    float fres=fresnel(0.,1.,5.,viewDir,normal);
    vec3 fresLight=fres*fresColor*fresIntensity;
    col+=fresLight*objectColor;
    
    gl_FragColor=vec4(col,1.);
    
}