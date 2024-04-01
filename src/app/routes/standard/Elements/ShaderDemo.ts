import { Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector2 } from "three";
import createShielMaterial from '../materials/createShieldMaterial'
export class ShaderDemo {

    model: any;

    constructor() {
    }

    uniforms = {
        iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        iTime:{value:0.},
    }

    imgUniforms = {
        iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        iChannel0:{ value:new TextureLoader().load('assets/images.bei.jpg')  }
    }


    build() {
        const geometry = new PlaneGeometry(100, 100);
        this.model = new Mesh(geometry, this.shaderMaterial4());
        this.model.rotation.x = -Math.PI / 2;   
            // const animate=()=> {
        //     requestAnimationFrame(()=>animate());
        //     this.uniforms.iTime.value += 0.1;
        // }

        // animate()
    }


    getShaderMaterial() {
        return ''
    }


    // 全色着色器
    shaderMaterial1(): any {
        const vertexShader = `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `;
        const fragmentShader = `
            void main() {
                vec3 color = vec3(1.0,0.0,0.0); // 红色
                gl_FragColor = vec4(color, 1.0); 
            }
        `;

        // 创建ShaderMaterial
        return new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
    }

    // 4色平分着色器
    shaderMaterial2() {
        const vertexShader = `
            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `
        const fragmentShader = `
            uniform vec2 iResolution;

            void main() {
                vec3 color1=vec3(1.,0.,1.);
                vec3 color2=vec3(1.,1.,0.);
                vec3 color3=vec3(0.,0.,1.);
                vec3 color4=vec3(1.,0.,0.);

                if (gl_FragCoord.x < iResolution.x * 0.25) {
                    gl_FragColor = vec4(color1, 1.0);
                } else if (gl_FragCoord.x < iResolution.x * 0.5) {
                    gl_FragColor = vec4(color2, 1.0);
                } else if (gl_FragCoord.x < iResolution.x * 0.75) {
                    gl_FragColor = vec4(color3, 1.0);
                } else {
                    gl_FragColor = vec4(color4, 1.0);
                }
            }
        `

        return new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
            }
        })
    }

    // uv坐标
    shaderMaterial3(): any {
        const vertexShader = `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `;
        const fragmentShader = `
            uniform vec2 iResolution;
            uniform float iTime;

            // 长方形
            float sdBox(in vec2 p,in vec2 b){
                vec2 d=abs(p)-b;
                return length(max(d,0.))+min(max(d.x,d.y),0.);
            }

            // 三角形
            float sdEquilateralTriangle(in vec2 p,in float r)
                {
                    const float k=sqrt(3.);
                    p.x=abs(p.x)-r;
                    p.y=p.y+r/k;
                    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
                    p.x-=clamp(p.x,-2.*r,0.);
                    return-length(p)*sign(p.y);
                }

                
            mat2 rotation2d(float angle){
                    float s=sin(angle);
                    float c=cos(angle);
                
                    return mat2(
                        c,-s,
                        s,c
                    );
                }
            
            // 旋转    
            vec2 rotate(vec2 v,float angle){
                    return rotation2d(angle)*v;
                }

            void main() {
                vec2 uv = vec2( gl_FragCoord.x/iResolution.x , gl_FragCoord.y/iResolution.y );

                // 案例1:
                // gl_FragColor = vec4(uv.x,uv.y,0.0,1.0);

                // 案例2:
                // float d=length(uv);  // 计算UV上点到原点的距离
                // gl_FragColor=vec4(vec3(d),1.);

                // 案例3:圆形
                // uv=(uv-.5)*2.; // uv的居中处理
                // uv.x*=iResolution.x/iResolution.y; // 修改画布比列
                // float d = length(uv);
                // d-=.5;
                // float c=0.;
                // if(d>0.){
                //     c=1.0;
                // }else{
                //     c=0.0;
                // }
                // float c=step(0.,d);  // d > 0.(edge值) 则返回1 , 反之为0
                // float c = smoothstep(0.,0.01,d); // 小于edge1返回 0 , 大于edge2返回1 , edge1-edge2之前返回0-1的平滑值
                // gl_FragColor=vec4(vec3(c),1.);

                // 案例4: 
                // uv=(uv-0.5)*2.;
                // uv.x*=iResolution.x / iResolution.y;
                // float d = length(uv);
                // // d-=0.5;
                // // float c = smoothstep(0.,0.2,d);
                // float c=.25/d;
                // c=pow(c,10.6);
                // gl_FragColor = vec4(vec3(c),1.0); 


                // 案例5: SDF函数( 长方形 )
                // uv=(uv-0.5)*2.;
                // uv.x*=iResolution.x / iResolution.y;
                // float d=sdBox(uv,vec2(.4,.4)); // 调用它获取距离
                // float c=smoothstep(0.,.2,d);
                // gl_FragColor=vec4(vec3(c),1.);

                //案例6: UV变换
                // uv=(uv-0.5)*2.;
                // uv+=0.5; // 原点向左下方移动
                // gl_FragColor = vec4(uv,0.,1.); 
                // uv.x*=iResolution.x / iResolution.y;
                // uv-=vec2(.2,.4);  // 移动
                // uv*=vec2(2.,2.);      // 缩放 
                // uv.y*=-1.;   //翻转
                // float PI=3.14159265359;
                // uv=rotate(uv,iTime);
                // float d=sdEquilateralTriangle(uv,.5);
                // float c=smoothstep(0.,.02,d);
                // gl_FragColor=vec4(vec3(c),1.);


                //案例7: mix函数
                #define mix(x,y,t) x*(1.-t)+y*t
            }
        `;

        // 创建ShaderMaterial
        return new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms
        }); 
    }


    // 图片
    shaderMaterial4(){
        console.log(this.imgUniforms);
        
        const vertexShader = `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `;
        const fragmentShader = `

        uniform sampler2D iChannel0;
        uniform vec2 iResolution;

        void main() {
            vec2 uv = vec2( gl_FragCoord.x/iResolution.x , gl_FragCoord.y/iResolution.y );
            vec3 tex = texture2D( iChannel0, uv ).xyz;
            gl_FragColor = vec4( tex, 1.0 );
        }
        `
        return new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms:this.imgUniforms
        })
    }







}



