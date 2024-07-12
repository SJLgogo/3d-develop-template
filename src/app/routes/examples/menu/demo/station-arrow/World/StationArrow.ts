import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { UniformInjector } from "src/app/routes/su7/kokomi/components/uniformInjector";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import fragmentShader from '../Shader/fragmentShader.glsl'
import vertexShader from '../Shader/vertexShader.glsl'
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { BlendFunction, EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";

export class StationArrow extends Base {

    am: AssetManager;

    declare arrowMesh: THREE.Mesh;

    constructor(eleName: string) {
        super(eleName)

        const camera: any = this.camera;
        camera.position.copy(new THREE.Vector3(10, 10, 10));
        camera.fov = 35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        this.scene.background = new THREE.Color("#0b0b11");

        const am = new AssetManager(this, {
            resources: [
                { name: 'arrow', type: LoaderType.Texture, path: 'assets/images/arrow2.png' },
                // { name: 'arrow', type: LoaderType.Texture, path: 'assets/images/arrow1.png' },
            ]
        })
        this.am = am

        this.am.on('ready', () => {
            this.initArrowPlane();
        })

        this.useCameraControls();

        this.initBloomComposer();

        this.AxesHelper2(200);
    }

    // 设置辉光composer
    initBloomComposer() {
        const effect = new SelectiveBloomEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: 0.8,
            opacity: 0.6,
            intensity: 7.0
        });
        effect.inverted = true;  // 辉光效果将应用于未选中的对象
        effect.ignoreBackground = true  // 辉光效果将忽略背景
        effect.selection.set([this.arrowMesh])  //清空选择集 所有对象都会应用辉光效果

        let composerBloom = new EffectComposer(this.renderer);
        composerBloom.addPass(new RenderPass(this.scene, this.camera))
        const effectPass = new EffectPass(this.camera, effect);
        composerBloom.addPass(effectPass);
        this.composer = composerBloom
    }



    // 增加原点坐标
    AxesHelper2(number: number): void {
        const axesHelper = new THREE.AxesHelper(number);
        this.scene.add(axesHelper);
    }


    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
    }


    initArrowPlane() {
        const geometry = new THREE.PlaneGeometry(2, 5);
        const texture = this.am.resources['arrow'];
        texture.minFilter = THREE.LinearFilter; // 或者使用其他合适的过滤模式
        const material = new THREE.ShaderMaterial({
            uniforms: {
                arrowTexture: { value: texture },
                uScrollYSpeed: { value: 1.0 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,  // 透明
            side: THREE.DoubleSide,
        })
        const uj = new UniformInjector(this)
        material.uniforms = { ...material.uniforms, ...uj.shaderToyUnidorms }

        const mesh = new THREE.Mesh(geometry, material)
        this.arrowMesh = mesh;
        this.update(() => {
            uj.injectShadertoyUniforms(material.uniforms)
        })

        this.scene.add(mesh)
    }



}