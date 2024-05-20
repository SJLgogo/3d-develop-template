import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { RaycastSelector } from "src/app/routes/su7/kokomi/components/raycastSelector";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import * as dat from 'dat.gui';
import { BloomEffect } from "src/app/routes/su7/kokomi/postprocessing/bloomEffect";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { flatModel, printModel } from "src/app/routes/su7/kokomi/utils/misc";

export class Bloom extends Base {

    am: AssetManager;



    constructor(eleName: string) {
        super(eleName)

        this.scene.background = new THREE.Color("black");

        const camera = this.camera as THREE.PerspectiveCamera;
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            2, 2, 2
        );
        camera.position.copy(cameraPos);
        const lookAt = new THREE.Vector3(0, 0, 0);
        camera.lookAt(lookAt);

        const am = new AssetManager(this, {
            resources: [
                { name: 'PrimaryIonDrive', type: LoaderType.GLTF, path: 'assets/models/gltf/PrimaryIonDrive.glb' },
            ]
        })
        this.am = am



        this.useCameraControls()

        const customEffect = new CustomEffect(this)
        customEffect.addExisting()



        this.am.on('ready', () => this._initReady())

    }

    _initReady() {
        this._addObject()
        // this._initGui()

    }

    _addObject() {

        const primaryIonDrive = new PrimaryIonDrive(this)
        primaryIonDrive.addExisting()

    }

    _initGui() {
        const gui = new dat.GUI()
    }


    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
    }
}


class PrimaryIonDrive extends Component {

    model: any;

    modelParts:any= []

    mixer: THREE.AnimationMixer;


    constructor(base: Bloom) {
        super(base)

        const model = base.am.resources['PrimaryIonDrive'].scene
        this.model = model

        this.modelParts = flatModel(model)

        console.log(this.modelParts);

        this.mixer = new THREE.AnimationMixer(model);
        const animationClip = base.am.resources['PrimaryIonDrive'].animations[0];
        const action = this.mixer.clipAction(animationClip);
        action.play();
    }

    update(time: number) {

        this.mixer.update(this.base.clock.deltaTime);

    }


    addExisting() {
        this.base.scene.add(this.model)
    }
}


class CustomEffect extends Component {
    params = {
        threshold: 0,
        strength: 1,
        radius: 0,
    }
    declare composer: any;

    constructor(base: Base) {
        super(base)

        const composer = new EffectComposer(base.renderer)

        const renderPass = new RenderPass(base.scene, base.camera)


        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
        bloomPass.threshold = this.params.threshold;
        bloomPass.strength = this.params.strength;
        bloomPass.radius = this.params.radius;


        const outputPass = new OutputPass()


        composer.addPass(renderPass)
        composer.addPass(bloomPass)
        composer.addPass(outputPass)


        this.composer = composer
    }


    addExisting() {
        this.base.composer = this.composer
    }




}
