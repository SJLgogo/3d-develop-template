import { GUI } from "dat.gui";
import resource from "src/app/routes/huiztech-pro/home/resource";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { LineClipWorld } from "./LineClipWorld";
import { OutLineClip } from "./OutLineClip";
import { getEnvmapFromHDRTexture } from "src/app/routes/su7/kokomi/utils/misc";

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
                { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
            ]
        })
        this.am = am

        const lineClipWorld = new LineClipWorld(this);
        this.lineClipWorld = lineClipWorld;

        const clipedge = new OutLineClip(this);
        this.clipedge = clipedge;

        this.am.on('ready', () => {
            
            const envMap = getEnvmapFromHDRTexture(this.renderer, am.resources["hdr"]);
            this.scene.environment = envMap;
            
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

        // 初始化切割面 , composer
        this.lineClipWorld.init();

        // 平面裁剪
        this.clipedge._init();

        // 加入车辆模型
        this.lineClipWorld.addExisting();

    }

 


}