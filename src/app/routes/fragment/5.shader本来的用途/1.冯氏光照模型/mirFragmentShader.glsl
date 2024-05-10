
varying vec2 vUv;
varying vec3 vNormal;// 法向量
varying vec3 vWorldPosition;



void main(){
    
    vec2 uv = vUv;

    // 环境光
    vec3 col=vec3(0.);
    vec3 objectColor=vec3(1.);// 物体的基础颜色 白色
    vec3 lightColor=vec3(.0863,.5255,.1216);// 光照颜色
    float ambIntensity=.2;  // 光照强度
    col += ambIntensity*lightColor;

    // 漫反射
    vec3 lightPos=vec3(10.,10.,10.);
    vec3 lightDir=normalize(lightPos-vWorldPosition);
    float diff=dot(vNormal,lightDir);
    diff=max(diff,0.);
    vec3 diffuse=lightColor*diff;
    col+=diffuse*objectColor;

    // 镜面反射
    /**
        实现: 
        1.获取反射光的方向向量
        2.获取眼睛的方向向量
        3.计算镜面高光因子 
        4.计算镜面反射光
     */
    vec3 reflectDir=reflect(-lightDir,vNormal);
    vec3 viewDir=normalize(cameraPosition-vWorldPosition);

    // float spec=dot(viewDir,reflectDir);  // 计算高光因子

    // Blinn-Phong 光照模型
    vec3 halfVec=normalize(lightDir+viewDir);
    float spec=dot(vNormal,halfVec);

    spec=max(spec,0.);
    float shininess=32.;
    spec=pow(spec,shininess);
    vec3 specular=lightColor*spec;  // 计算镜面反射光
    col+=specular*objectColor;

    gl_FragColor=vec4(col,1.);
}