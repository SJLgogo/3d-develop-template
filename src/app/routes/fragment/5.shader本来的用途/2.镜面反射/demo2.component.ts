import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { UniformInjector } from 'src/app/routes/su7/kokomi/components/uniformInjector';
import { CameraControls } from 'src/app/routes/su7/kokomi/controls/cameraControls';
import * as THREE from 'three';
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import { AssetManager, LoaderType } from 'src/app/routes/su7/kokomi/components/assetManager';
import { getEnvmapFromHDRTexture } from 'src/app/routes/su7/kokomi/utils/misc';

@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.less']
})
export class Demo2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Demo('#three')
  }

}

export  class Demo extends Base{

  am:AssetManager;

  constructor(eleName:string){
      super(eleName)

      this.scene.background = new THREE.Color('black')
  
      const camera = this.camera as THREE.PerspectiveCamera;
      camera.updateProjectionMatrix();
      const cameraPos = new THREE.Vector3(
        5,5,5
      );
      camera.position.copy(cameraPos);
      const lookAt = new THREE.Vector3(0, 0, 0);
      camera.lookAt(lookAt);

      const am = new AssetManager(this, {
        resources: [
          { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
        ]
      })
      this.am = am

      this.useCameraControls()

      this.am.on('ready', async ()=>{
        const envmap = await this.getEnvMap()
        console.log(envmap);
        await this.createSqere(envmap)
      })
  }


  getEnvMap(){
    const envmap = new THREE.CubeTextureLoader().load([
      "https://s2.loli.net/2022/09/29/X8TDZROlUo6uAyG.png",
      "https://s2.loli.net/2022/09/29/KYEJ9ylQNIe6h4R.png",
      "https://s2.loli.net/2022/09/29/GqseLg6tWoluDzV.png",
      "https://s2.loli.net/2022/09/29/LUk8P21MJG6AtNF.png",
      "https://s2.loli.net/2022/09/29/4BO1JHoM3phFCb7.png",
      "https://s2.loli.net/2022/09/29/5NvAxfCVqlKFRZU.png",
    ]);  
    return envmap
  }

  useCameraControls() {
      const cameraControls = new CameraControls(this)
      cameraControls.controls.setTarget(0, 0, 0);
  }

  createSqere(envmap:any){
      // const geometry = new THREE.SphereGeometry(2 , 64 , 64 )
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);

      const shaderMaterial:any= new ShaderMaterial({envmap:envmap})
      const uj = new UniformInjector(this)
      shaderMaterial.uniforms = {...shaderMaterial.uniforms , ...uj.shaderToyUnidorms}
      
      const mesh = new THREE.Mesh(geometry , shaderMaterial)
      this.scene.add(mesh)

      this.update(()=>{
          uj.injectShadertoyUniforms(shaderMaterial.uniforms)
          
          const t = this.clock.elapsedTime;
          mesh.rotation.y = 0.2 * t;
      })
  }


}


class ShaderMaterial{
  constructor(params:any){
      const material = new THREE.ShaderMaterial({
          uniforms:{
            iChannel0:{value:params.envmap}
          },
          vertexShader:vertexShader,
          fragmentShader:fragmentShader, 
      })

      return material
  }
}