/**
 * fragColor: 四维数据代表颜色
 * fragCoord: 二维数据代表坐标
 * shader 中变量值范围都是[0 , 1] , 当值超过时需要进行'归一化' 
 */

/**
 * 功能1 : 得到归一化坐标uv
 */
var demo = `
    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        vec2 uv = fragCoord / iResolution.xy;

        fragColor = vec4(uv.x,0.,0.,1.);  // x -> [0,1]
        fragColor = vec4(0.,ux.y,0.,1.);  // y -> [0,1]
        fragColor = vec4(uv,0.,1.)   // 代表了画布上所有像素的归一化坐标 , u代表水平方向 , v代表垂直方向
    }
`

/**
 * 功能2 : 得到一个圆形
 * 
 * 思路 : 计算uv坐标上的点到原点的距离 , 根据这些距离的值来设定对应点颜色 
 */

/** 计算uv上点到原点的距离 */
var demo = `
    float d = length(uv);
    fragColor = vec4(vec3(d),1.);    // 左下角原点是黑色点 , 值是(0,0) , 靠近原点距离越小，越接近黑色 , 反之越远离距离越大 , 颜色越白
`

/** uv居中处理 */
var demo = `
    uv=(uv-.5)*2.;
`

/** 
 * uv居中根据距离得到一个圆
 * 效果 : 虚化的椭圆
 */
var demo = `
    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        vec2 uv = fragCoord / iResolution.xy;
        uv = (uv-.5)*2.;
        float d = length(uv);
        fragColor = vec4(vec3(d),1.0);
    }
`

/** 计算画布比例 */
var demo = `
    uv.x*=iResolution.x / iResolution.y
`

/**
 * 在shader中 , 值得显示范围只会是[0，1] , 小于0的值还是0(黑色) , 小于1的值还是1(白色)
 * 去除中间的渐变区域
 */
var demo = `
    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        vec2 uv = fragCoord / iResolution.xy;
        uv.x*=iResolution.x/iResolution.y;
        uv = (uv-.5)*2.;
        float d = length(uv);
        d-=.5;
        float c = 0.;
        if(d>0.){
            c=1.;
        }else{
            c=0.;
        };
        float c=step(0.,d);
        fragColor = vec4(vec3(c),1.0);
    }
`

/** 
 * 避免使用If语句 , GPU是并行处理结果的 , 而If会让处理器进行分支切换这一操作 
 * 
 * 阶梯函数 : 目标值大于边界值 返回 1 否则 0；
 * 边界值 : edge 
 * 目标值 : x  
 */
var demo = `
    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        step(edge,x)
    }
`

/**
 * 
 */
