import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { AssetManager, LoaderType } from 'src/app/routes/su7/kokomi/components/assetManager';
import { CameraControls } from 'src/app/routes/su7/kokomi/controls/cameraControls';
import { Environment } from 'src/app/routes/su7/kokomi/lights/environment';
import { getEnvmapFromHDRTexture, flatModel } from 'src/app/routes/su7/kokomi/utils/misc';
import * as THREE from 'three';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-scene-switching',
  templateUrl: './scene-switching.component.html',
  styleUrls: ['./scene-switching.component.less']
})
export class SceneSwitchingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    new Demo('#three')
  }
  
}

class Demo extends Base {

  am: AssetManager;

  declare env: Environment;

  declare material:THREE.MeshStandardMaterial;

  constructor(ele: string) {
    super(ele)


    const camera = this.camera as THREE.PerspectiveCamera;
    camera.updateProjectionMatrix();
    const cameraPos = new THREE.Vector3(
      100, 100, 100
    );
    camera.position.copy(cameraPos);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);


    const environment = new Environment(this, {
      scene: this.scene,
      options: {
        minFilter: THREE.LinearMipMapLinearFilter,
        anisotropy: 0,
        depthBuffer: false,
        generateMipmaps: true,
      }
    })
    this.env = environment


    const am = new AssetManager(this, {
      resources: [
        { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
        { name: 'hdr2', type: LoaderType.HDR, path: "assets/sketch/source/env2.hdr", },
      ]
    })
    this.am = am

    this.useCameraControls()

    this.createCircle()

    this.am.on('ready', () => {
      const envMap = getEnvmapFromHDRTexture(this.renderer, am.resources["hdr"]);
      this.scene.environment = envMap;
      this.scene.background = envMap;

      this._createDebug()
    })
  }


  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }


  // 创建一个反射球体
  createCircle() {
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshStandardMaterial({
      envMap: this.env.cubeRenderTarget.texture,
      roughness: 0.05, //材质的粗糙度 
      metalness: 1,   //材质的金属度
    });
    this.material = material;
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    this.scene.add(sphere);


    const geometry1 = new THREE.SphereGeometry(5, 32, 32)
    const material1 = new THREE.MeshBasicMaterial({color:'red'})
    const sphere2 = new THREE.Mesh(geometry1, material1);
    sphere2.position.set(20, 0, 0);
    this.scene.add(sphere2);
  }


  _createDebug(){
    const gui = new dat.GUI();
    const energyFolder = gui.addFolder('球体参数')
    energyFolder.add(this.material,'roughness').min(0).max(1).step(0.01).name('粗糙度')
    energyFolder.add(this.material,'metalness').min(0).max(1).step(0.01).name('金属度')

    energyFolder.open()
}



}
