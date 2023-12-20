import { Scene, Vector2, WebGLRenderTarget, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import Camera from "./Camera";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

export default class Composer {

    declare composer: EffectComposer;

    declare renderer: WebGLRenderer;

    declare scene: Scene

    declare camera: Camera

    declare renderPass: any;

    declare outlinePass: any;


    selectedObjects: any[] = []

    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.initLinePass()
    }


    initLinePass(): void {
        const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            depthBuffer: true,
            stencilBuffer: false,
        });
        this.composer = new EffectComposer(this.renderer, renderTarget);
        this.renderPass = new RenderPass(this.scene, this.camera.main);
        this.renderPass.depthWrite = true;
        this.outlinePass = new OutlinePass(
            new Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera.main
        );
        var params = {
            edgeStrength: 3.0,
            edgeGlow: 2,
            edgeThickness: 1.0,
            pulsePeriod: 0,
            usePatternTexture: false
        };
        this.outlinePass.edgeStrength = params.edgeStrength;  // 粗细
        this.outlinePass.edgeGlow = params.edgeGlow;  // 发光
        this.outlinePass.renderToScreen = true;
        this.outlinePass.selectedObjects = this.selectedObjects;
        this.outlinePass.visibleEdgeColor.set(0xFEFF00);
        this.outlinePass.pulsePeriod = 2 //闪烁 
        this.composer.addPass(this.renderPass);   // 必须在前
        this.composer.addPass(this.outlinePass);  // 必须在后
        // 放在renderPass之后,解决环境变暗问题
        const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaCorrectionShader);
    }


    update(): void {
        this.selectedObjects.length && this.composer.render()
    }


}