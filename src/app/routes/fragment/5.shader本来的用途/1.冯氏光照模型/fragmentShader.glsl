
varying vec2 vUv;
varying vec3 vNormal;// 法向量
varying vec3 vWorldPosition;

/**
冯氏光照模型: ( 环境光 )
环境光是指物体表面受到来自周围环境光源的光照，这种光照均匀地分布在物体的表面上。
*/
void main(){
    
    vec2 uv = vUv;
    
    vec3 col = vec3(0.);  // 黑色(因为还没有光)
    vec3 objectColor = vec3(1.); // 物体的基础颜色 白色
    vec3 lightColor=vec3(0.0863, 0.5255, 0.1216);  // 光照颜色
    
    float ambIntensity=.2;  // 光照强度
    vec3 amblient = lightColor * ambIntensity; // 环境光是光照颜色与环境光照强度的乘积
    col += amblient;
    
    
    /** 漫反射效果
    1.获取法向量N
    2.获取光线的方向向量 ( 光源位置 - 片元着色器位置 )
    3.计算漫反射因子 ( 漫反射的强度，跟入射角θ )
    4.计算漫反射光
    */
    vec3 lightPos=vec3(2.,3.,2.);
    vec3 lightDir=normalize(lightPos-vWorldPosition);// 光线方向 : 片元位置 -> 光源位置
    
    float diff=dot(lightDir,vNormal);// 通过点积得到 cos余弦 值 ， 为反射强度
    diff=max(diff,0.);
    vec3 diffuse = lightColor * diff;
    
    col += diffuse ;
    
    gl_FragColor=vec4(col,1.);
}