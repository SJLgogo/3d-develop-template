import { EffectComposer, RenderPass, ShaderPass } from "three-stdlib";
import { Base } from "../Base/base";
import { Component } from "../components/component";
import * as THREE from "three";
import { UniformInjector } from "../components/uniformInjector";

const defaultVertexShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const defaultFragmentShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec4 color=texture(tDiffuse,p);
    gl_FragColor=color;
}
`;

export class CustomEffect extends Component{

    composer:any;

    declare uniformInjector:UniformInjector;

    declare shaderPass:ShaderPass;
    

    constructor(base:Base , config:any={}){
        super(base)

        const composer = new EffectComposer(base.renderer)
        this.composer = composer

        const renderPass = new RenderPass(base.scene, base.camera);
        composer.addPass(renderPass);

    }


    addShaderPass(config:any={}){
        const {
            vertexShader = defaultVertexShader,
            fragmentShader = defaultFragmentShader,
            uniforms = {},
          } = config;
        const uniformInjector = new UniformInjector(this.base);
        this.uniformInjector = uniformInjector
        
        const customPass = new ShaderPass({
            vertexShader,
            fragmentShader,
            uniforms:{
                ...{
                    tDiffuse: {
                      value: null,
                    },
                  },
                ...uniformInjector.shaderToyUnidorms,
                ...uniforms,
            }
        })
        this.shaderPass = customPass;
        customPass.renderToScreen = true;
        this.composer.addPass(customPass);
    }

    addExisting(): void {
        this.base.composer = this.composer;
    }
}