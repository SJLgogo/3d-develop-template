import { Base } from "../../kokomi/Base/base";
import * as THREE from "three";
import { OrbitControls } from "../../kokomi/controls/orbitControls";
import { CameraControls } from "../../kokomi/controls/cameraControls";
import { AssetManager } from "../../kokomi/components/assetManager";
import resources from "./resources";
import World from "./world/world";


export default class Experience extends Base{

    declare cameraControls:CameraControls;

    am:AssetManager;

    world:World

    params={
        cameraPos: {
            x: 0,
            y: 0.8,
            z: -11,
          },
      cameraFov: 33.4,
    }

    
    constructor(sel = "#sketch"){
        super(sel)

        this.am = new AssetManager(this,{resources:resources})


        const camera = this.camera as THREE.PerspectiveCamera
        camera.fov = this.params.cameraFov;
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            this.params.cameraPos.x,
            this.params.cameraPos.y,
            this.params.cameraPos.z
        )
        camera.position.copy(cameraPos);
        const lookAt = new THREE.Vector3(0, 0.8, 0);
        camera.lookAt(lookAt);

        // this.useCameraControls()
        this.useOrbitControls()

        this.world = new World(this);

    }



    useOrbitControls(){
        new OrbitControls(this)
    }

    useCameraControls(){
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0.8, 0);
        this.cameraControls = cameraControls
    }



}