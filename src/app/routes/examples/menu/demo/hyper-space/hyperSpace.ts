import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { Points } from "./Elements/Points";
import { Force3 } from "../fire-ball/Class/Force3";

export class HyperSpace extends Base {

    declare points: Points;

    constructor(eleName: string) {
        super(eleName)

        const force:any = {
            position: new Force3(),
            look: new Force3(),
          };

        const camera:any= this.camera;
        // camera.position.copy(force.position.velocity);
        camera.position.copy(new THREE.Vector3(100,0,0));
        camera.fov=35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix(); 

        this.scene.background = new THREE.Color("#0b0b11");

        // this.useCameraControls()


        const points = new Points();
        points.init()
        // camera.position.anchor.set(800, 0, 0);
        this.scene.add(points.mesh)

        this.update(()=>{
            points.update()
        })
        this.points = points;

    }


    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
    }
}