var demo = `
    float foo = 1.;
    int foo = 1 ;
`

var demo = `
    bool foo = true;
    bool bar = fragCrood.x < iResolution.x*.25;
    if(bar){
        fragColor = vec4(vec3(1.,1.,1.),1.)
    }
`

/**
 *  二维 vec2 
 *  三维 vec3 
 * 
 *  四维 vec4  
 *  4个维度分别为 x , y , z , w ( 也可以写为 r , g , b , a ) 
 */
var demo = `
    vec2 a = vec2(1.,0.);
    vec3 b = vec3(1.,.5,0.);
    vec4 c = vec4(1.,.5,0.,1.);

    vec2 d = b.xy;  // d的值为 vec2(1.,.5)
    d.y = 2.; // d的值为 vec2(1.,2.)
    vec3 e = c.yxy ; // e的值为 vec3(.5,1.,.5)
    e.zx = vec2(1.)  // e的值为 vec3(1.,1.,1.)
`

/**
 * mat类型 (矩阵类型)
 * 
 * mat2 : 2x2的矩阵
 * mat3 : 3x3的矩阵
 * mat4 : 4x4的矩阵
 */

var demo = `
    mat2 m1 = mat2(1.,0.,0.,1.)
    mat3 m2=mat3(1.,2.,0.,0.,0.,1.,2.,1.,0.);
    mat4 m3=mat4(1.,2.,1.,0.,1.,1.,1.,0.,0.,0.,0.,1.,0.,1.,0.,1.);
`

/**
 * 如果想把多个变量捆绑到一个变量上 , 使用结构 struct
 */

var demo = `
    struct ray{
        vec3 ro;
        vec4 rd;
    }

    void mainImage(out vec4 fragColor , in vec2 fragCoord){
        ray a;
        vec3 ro = vec3(1.,0.,0.);
        a.ro = ro;
        a.rd = vec3(0.,0.,.2);
        fragColor = vec4(a.ro,1.);
    }

    float a,b,c,d;
    a=b=c=d=3.;
`

/** 
 * 函数
 */
var demo = `
    float add(float a , float b){
        return a + b
    }
`

/** 
 * 变量限定符 : uniform , const , varying , attribute 
 * 用来描述变量的存储和使用方式的关键字
 * 
 * uniform : 
 * 是一个全局的变量 , 一旦定义后会同时存在于顶点着色器和片元着色器中 ,并且在每个顶点和片元中的值是相同的 , 是一个 '统一' 的值 
 * 
 * iTime :
 * 变量表示 shader 从开始到执行所经过的时间
 * 
 * iResolution :
 * shader画布所在的大小 , 默认是占满整个屏幕 , 有时需要根据屏幕的比例对shader坐标进行调整
 * 
 * iMosue :
 * 用户当前所在鼠标的位置
 * 
 */
var demo = `
    uniform vec3 uColor;  // 声明一个uniform类型的名为uColor的三维向量

    iTime ; 
    iResolution ;
    iMouse ;
`


/**
 * 宏 ( marcos ) 
 * 一种预处理指令 , 于在编译时进行文本的替换，常用于定义常量、函数、条件编译等。
 * 
 * #define 宏的名称 宏的值
 * 
 */
var demo = `
    #define PI 3.14  // Shader编译时会将所有的PI替换为3.14这个值 , 类比于JS的String.replace()

    #define add(a,b) a+b
` 