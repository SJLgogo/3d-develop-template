/**
 * fragColor: 四维数据代表颜色
 * fragCoord: 二维数据代表坐标
 * shader 中变量值范围都是[0 , 1] , 当值超过时需要进行'归一化' 
 */

/**
 * 功能 : 得到归一化坐标uv
 */
var demo = `
    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        vec2 uv = fragCoord / iResolution.xy;

        fragColor = vec4(uv.x,0.,0.,1.);  // x -> [0,1]
        fragColor = vec4(0.,ux.y,0.,1.);  // y -> [0,1]

    }
`


