import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { Points } from "./Points";
import { Base } from "src/app/routes/su7/kokomi/Base/base";

export class ParticleTransform extends Base {

    declare am: AssetManager;

    declare points: Points;

    constructor(eleName: string) {
        super(eleName)

        const camera: any = this.camera;
        camera.position.copy(new THREE.Vector3(100, 0, 0));
        camera.fov = 35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        this.scene.background = new THREE.Color("#0b0b11");

        this.AxesHelper2(200);

        this.useCameraControls()

        const am = new AssetManager(this, {
            resources: [
                { name: 'car', type: LoaderType.GLTF, path: 'assets/sketch/source/car.glb' },
            ]
        })
        this.am = am

        this.am.on('ready', () => this._init())
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


    _init() {
        const points = new Points();
        this.points = points
        this.scene.add(points.mesh)
    }



}