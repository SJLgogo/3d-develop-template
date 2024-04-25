import { LoaderType } from "src/app/routes/standard/utiles/Loader";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { OrbitControls } from "src/app/routes/su7/kokomi/controls/orbitControls";
import * as THREE from "three";

export default class Halo extends Base{

    am!:AssetManager;

    constructor(ele:string){
        super(ele)

        const camera = this.camera
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            10,10,10
        );
        camera.position.copy(cameraPos);

        const am = new AssetManager(this,{resources:[
            { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
        ]})
        this.am = am

        this.useCameraControls()
        
        this.am.on('ready',()=> this._init())

    }


    _init(){
        
    }

    useCameraControls(){
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0.8, 0);
    }
}