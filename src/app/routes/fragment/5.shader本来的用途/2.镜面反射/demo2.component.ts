import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { UniformInjector } from 'src/app/routes/su7/kokomi/components/uniformInjector';
import { CameraControls } from 'src/app/routes/su7/kokomi/controls/cameraControls';
import * as THREE from 'three';
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'

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

      this.useCameraControls()

      this.createSqere()
  }

  useCameraControls() {
      const cameraControls = new CameraControls(this)
      cameraControls.controls.setTarget(0, 0, 0);
  }

  createSqere(){
      const geometry = new THREE.SphereGeometry(2 , 32 , 32 )

      const shaderMaterial:any= new ShaderMaterial()
      const uj = new UniformInjector(this)
      shaderMaterial.uniforms = {...shaderMaterial.uniforms , ...uj.shaderToyUnidorms}
      
      const mesh = new THREE.Mesh(geometry , shaderMaterial)
      this.scene.add(mesh)

      this.update(()=>{
          uj.injectShadertoyUniforms(shaderMaterial.uniforms)
      })
  }


}


class ShaderMaterial{
  constructor(){
      const material = new THREE.ShaderMaterial({
          uniforms:{

          },
          vertexShader:vertexShader,
          fragmentShader:fragmentShader, 
      })

      return material
  }
}