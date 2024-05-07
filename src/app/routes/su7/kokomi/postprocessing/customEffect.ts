import { Base } from "../Base/base";
import { Component } from "../components/component";
import * as THREE from "three";
import { UniformInjector } from "../components/uniformInjector";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FXAAShader } from "three-stdlib";


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

export class CustomEffect extends Component {

    composer: any;

    declare uniformInjector: UniformInjector;

    declare shaderPass: ShaderPass;

    declare outlinePass:OutlinePass;

    outLineSelectedObjects:THREE.Object3D[]=[]

    constructor(base: Base) {
        super(base)

        const composer = new EffectComposer(base.renderer)
        this.composer = composer

        const renderPass = new RenderPass(base.scene, base.camera);
        composer.addPass(renderPass);
    }


    addShaderPass(config: any = {}) {
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
            uniforms: {
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


    /** outLinePass */
    addOutLinePass(config:any={}) {
        const outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.base.scene,
            this.base.camera
        );
        this.outlinePass = outlinePass
        const params ={...{
            edgeStrength: 3.0,
            edgeGlow: 2,
            edgeThickness: 1.0,
            pulsePeriod: 0,
            visibleEdgeColor:'#ffffff',
            hiddenEdgeColor :'#190a05',
            usePatternTexture: false
        } , ...config};
        outlinePass.edgeStrength = params.edgeStrength;  // 粗细
        outlinePass.edgeGlow = params.edgeGlow;  // 发光
        outlinePass.edgeThickness = params.edgeThickness;  // 轮廓线宽度
        outlinePass.pulsePeriod =  params.pulsePeriod //闪烁 
        outlinePass.renderToScreen = true;
        outlinePass.selectedObjects = this.outLineSelectedObjects;
        outlinePass.visibleEdgeColor.set(params.visibleEdgeColor);
        outlinePass.hiddenEdgeColor.set(params.hiddenEdgeColor);
        this.composer.addPass(outlinePass);  // 必须在后
        // 放在renderPass之后,解决环境变暗问题
        const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaCorrectionShader);

        // 抗锯齿
        const effectFXAA = new ShaderPass( FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
		this.composer.addPass( effectFXAA );
    }

    addExisting(): void {
        this.base.composer = this.composer;
    }
}