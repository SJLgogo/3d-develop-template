import { GUI } from "dat.gui";
import resource from "src/app/routes/huiztech-pro/home/resource";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { LineClipWorld } from "./LineClipWorld";
import { OutLineClip } from "./OutLineClip";

export class LineClip extends Base {

    am: AssetManager;

    declare localPlane: THREE.Plane;

    declare clipedge:OutLineClip;

    planeObjects:any[]=[];
    planes:any[]=[];

    lineClipWorld:LineClipWorld;


    constructor(eleName: string) {
        super(eleName)

        const camera: any = this.camera;
        camera.position.copy(new THREE.Vector3(-358.77438399405463, 153.00048254218594, -471.581556865478));
        camera.fov = 35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        this.scene.background = new THREE.Color("#0b0b11");


        this.useCameraControls();

        const am = new AssetManager(this, {
            resources: [
                { name: 'car', type: LoaderType.GLTF, path: 'assets/sketch/source/car.glb' },
                // { name: 'car', type: LoaderType.GLTF, path: 'assets/glb/merge.gltf' },
                // { name: 'carModel', type: LoaderType.GLTF, path: 'assets/glb/scene_editor.glb' },
            ]
        })
        this.am = am

        const lineClipWorld = new LineClipWorld(this);
        this.lineClipWorld = lineClipWorld;

        const clipedge = new OutLineClip(this);
        this.clipedge = clipedge;

        this.AxesHelper2(1000)

        this.am.on('ready', () => {
            this._init();
        })
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
        this.lineClipWorld.init();
        this.clipedge._init();
        this.lineClipWorld.addExisting();


        this.lineClipWorld.changeWind();

    }

 


}