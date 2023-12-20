/**
 * 4维的 fragColor , 代表输出的像素颜色
 * 
 * 红色的rgb(255,0,0) , 在GLSL中要做归化处理(除255)
 * fragColor是一个4维变量 , 前3维就是这个颜色变量 ,后一维是透明度 
 * 
 * 2维的 fragCoord , 代表输入的像素坐标 , 大小决定于画面本身的大小
 * 
 */

/** 
 * 功能 : 单独的颜色
 * 
 */ 
const demo1 =
`
void mainImage(out vec4 fragColor , in vec2 fragCoord){
    vec3 color = vec3(1.,0.,0.);   
    fragColor = vec4(color,1.);
}
`

/** 
 *  功能 : 填充小于1/4的颜色
 *  在当前shader开发环境内, 有个内置变量iResolution , 代表了画面的整体大小 , 使用时一般取他的xy维度
 */
const demo2 = `
void mainImage(out vec4 fragColor , in vec2 fragCoord){
    vec3 color1=vec3(1.,0.,1.);
    vec3 color2=vec3(1.,1.,0.);
    vec3 color3=vec3(0.,0.,1.);
    vec3 color4=vec3(1.,0.,0.);
    if(fragCoord.x < iResolution.x*.25){
        fragColor = vec4(color1,1.);
    }
    if(fragCoord.x < iResolution.x*.5 && fragCoord.x > iResolution.x*.25){
        fragColor = vec4(color2,1.);
    }
    if(fragCoord.x < iResolution.x*.75 && fragCoord.x > iResolution.x*.5){
        fragColor = vec4(color3,1.);
    }
    if(fragCoord.x < iResolution.x*1.0 && fragCoord.x > iResolution.x*.75){
        fragColor = vec4(color4,1.);
    }
}

`


/**
 * 总结 : 
 * Shader的核心点 : 根据像素的坐标计算对应的颜色
 */