import * as THREE from "three";
import { Base } from "../../su7/kokomi/Base/base";
import { CameraControls } from "../../su7/kokomi/controls/cameraControls";
import { AssetManager } from "../../su7/kokomi/components/assetManager";
import resources from './resource'
import {World} from "./World/World";
import {Stats} from '../../su7/kokomi/components/state'

export class Huiztech extends Base{

    cameraControls!:CameraControls;

    params={
        cameraPos: {
            x: 2000,
            y: 500,
            z: 1060,
          },
      isCameraMoving:false , // 相机是否移动
    }

    am!:AssetManager;

    world:World;

    constructor(ele:string){
        super(ele)
   
        const camera = this.camera as THREE.PerspectiveCamera
        camera.far = 3000
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            this.params.cameraPos.x,
            this.params.cameraPos.y,
            this.params.cameraPos.z
        )
        camera.position.copy(cameraPos);
        const lookAt = new THREE.Vector3(1300, 0, 0);
        camera.lookAt(lookAt);

        this.useCameraController()

        
        const am = new AssetManager(this,{
            resources:resources
        })
        this.am = am

        const world = new World(this)
        this.world = world

        new Stats(this)

        this.update(()=>{
            if(this.params.isCameraMoving){
                this.cameraControls.controls.enabled = false; // 禁用相机交互
                this.cameraControls.controls.setPosition(
                    this.params.cameraPos.x,
                    this.params.cameraPos.y,
                    this.params.cameraPos.z
                  );
            }else{
                this.cameraControls.controls.enabled = true
            }
        })
    }

    useCameraController(){
        this.cameraControls = new CameraControls(this)
        this.cameraControls.controls.setTarget(1300, 0, 0);
    }

}