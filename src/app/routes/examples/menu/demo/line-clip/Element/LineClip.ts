import resource from "src/app/routes/huiztech-pro/home/resource";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";

export class LineClip extends Base{

    am:AssetManager;

    declare localPlane:THREE.Plane;
    

    constructor(eleName:string){
        super(eleName)

        const camera: any = this.camera;
        camera.position.copy(new THREE.Vector3(0, 2000, 0));
        camera.fov = 35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        this.useCameraControls();

        const am = new AssetManager(this,{
            resources:[
            ]
        })
        this.am = am

        this.am.on('ready',()=>{
        })
    }

    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
    }


    initPostGrocess(){

    }




}