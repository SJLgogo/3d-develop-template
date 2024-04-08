import * as THREE from "three";
import { Component } from "../../../kokomi/components/component";
import { FBO } from "../../../kokomi/renderTargets/Fbo";
import Experience from "../Experience";
import dynamicEnvVertexShader from "../Shaders/DynamicEnv/vert.glsl";
import dynamicEnvFragmentShader from "../Shaders/DynamicEnv/frag.glsl";
import { FullScreenQuad } from "../../../kokomi/three-stdlib/postprocessing/pass";

export class DynamicEnv extends Component{

    fbo:FBO;

    quad:FullScreenQuad;

    material:THREE.ShaderMaterial;
    
    constructor(base:Experience , config:any={}){
        super(base)

        const {envmap1 , envmap2} = config

        console.log(envmap1);

        const envData = envmap1 cx c-?.source.data;

        const fbo = new FBO(this.base , {
            width:envData.width,
            height:envData.height
        })
        this.fbo = fbo

        this.envmap.mapping = THREE.CubeUVReflectionMapping;
        
        const material = new THREE.ShaderMaterial({
            vertexShader:`
            uniform float iTime;
                uniform vec3 iResolution;
                uniform vec4 iMouse;

                varying vec2 vUv;

                void main(){
                    vec3 p=position;
                    gl_Position=vec4(p,1.);
                    
                    vUv=uv;
                }
            `,
            fragmentShader: 
            `
            uniform float iTime;
            uniform vec3 iResolution;
            uniform vec4 iMouse;

            varying vec2 vUv;

            uniform sampler2D uEnvmap1;
            uniform sampler2D uEnvmap2;
            uniform float uWeight;
            uniform float uIntensity;

            void main(){
                vec2 uv=vUv;
                vec3 envmap1=texture(uEnvmap1,uv).xyz;
                vec3 envmap2=texture(uEnvmap2,uv).xyz;
                vec3 col=mix(envmap1,envmap2,uWeight)*uIntensity;
                gl_FragColor=vec4(col,1.);
            }
            `,
            uniforms:{
                uEnvmap1:{
                    value:envmap1
                },
                uEnvmap2: {
                    value:envmap2,
                },
                uWeight: {
                    value: 0,
                },
                uIntensity: {
                    value: 1,
                },
            },
        })
        this.material = material

        const quad = new FullScreenQuad(material);
        this.quad = quad
    }


    update(){
        this.base.renderer.setRenderTarget(this.fbo.rt)
        this.quad.render(this.base.renderer);
        this.base.renderer.setRenderTarget(null)
    }

    setWeight(value: number) {
        this.material.uniforms.uWeight.value = value;
    }


    get envmap(){
        return this.fbo.rt.texture
    }

}