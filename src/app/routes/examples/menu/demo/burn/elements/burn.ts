import resource from "src/app/routes/huiztech-pro/home/resource";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import * as THREE from "three";
import { Vector3 } from "three";
import { ImageGroup } from "./ImageGroup";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";

export class Burn extends Base {

    imgGroup: ImageGroup;

    am: AssetManager;

    constructor(eleName: string) {
        super(eleName)

        const imgGroup = new ImageGroup()
        this.imgGroup = imgGroup

        const camera = this.camera;
        camera.position.copy(new THREE.Vector3(0, 0, 50))
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        this.useCameraControls()

        const am = new AssetManager(this, {
            resources: [
                { name: 'noise', type: LoaderType.Texture, path: 'assets/images/noise2.png' },
                { name: 'img1', type: LoaderType.Texture, path: 'assets/images/bei.jpg' },
                { name: 'img2', type: LoaderType.Texture, path: 'assets/images/noise.png' },
                { name: 'img3', type: LoaderType.Texture, path: 'assets/images/image03.jpg' },
            ]
        })
        this.am = am

        this.am.on('ready', () => {

            const noiseTex = this.am.resources['noise']
            noiseTex.wrapS = THREE.RepeatWrapping;  // 纹理在水平方向重复
            noiseTex.wrapT = THREE.RepeatWrapping;  // 纹理在垂直方向重复


            const imgTexes = Object.values(this.am.resources).slice(1);
            
            this.imgGroup.start(noiseTex, imgTexes)

            this.scene.add(this.imgGroup)
            
        })

        this.update(()=>{
            this.imgGroup.update(this.clock.deltaTime)
            
        })
    }

    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
      }


}