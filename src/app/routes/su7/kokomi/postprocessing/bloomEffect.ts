import { Base } from "../Base/base";
import { Component } from "../components/component";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import * as THREE from "three";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';



export class BloomEffect extends Component {

    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;

    bloomPass: UnrealBloomPass;

    darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    materials: any;

    bloomLayer: any;


    constructor(base: Base, config: any = {}) {
        super(base)

        const { materials, bloomLayer } = config
        this.materials = materials
        this.bloomLayer = bloomLayer

        const params: any = {
            ...{
                threshold: 0,  // 泛光阈值
                strength: 1,   // 泛光强度
                radius: 0.5,    // 泛光半径
            },
            ...config
        }


        const bloomComposer = new EffectComposer(base.renderer)
        const finalComposer = new EffectComposer(base.renderer)

        bloomComposer.renderToScreen = false;

        const renderPass = new RenderPass(base.scene, base.camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;
        this.bloomPass = bloomPass

        const mixPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                
                varying vec2 vUv;

                void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
                `,
                fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {

                    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1. ) * texture2D( bloomTexture, vUv ) );

                }
                
                `,
                defines: {}
            }), 'baseTexture'
        );
        mixPass.needsSwap = true;

        const outputPass = new OutputPass();

        bloomComposer.addPass(renderPass);
        bloomComposer.addPass(bloomPass);

        finalComposer.addPass(renderPass);
        finalComposer.addPass(mixPass);
        finalComposer.addPass(outputPass);


        this.bloomComposer = bloomComposer
        this.finalComposer = finalComposer

        this.addExisting()
    }

    update() {
        this.base.scene.traverse((obj) => this.darkenNonBloomed(obj))
        this.bloomComposer.render()

        this.base.scene.traverse((obj) => this.restoreMaterial(obj))
    }


    darkenNonBloomed(obj: any) {
        
        if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {

            this.materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;

        }
    }



    restoreMaterial(obj: any) {

        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }

    }


    addExisting(): void {
        this.base.composer = this.finalComposer;
    }




}