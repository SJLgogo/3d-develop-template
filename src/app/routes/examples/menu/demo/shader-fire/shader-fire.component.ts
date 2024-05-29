import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { CameraControls } from 'src/app/routes/su7/kokomi/controls/cameraControls';
import * as THREE from 'three';

@Component({
  selector: 'app-shader-fire',
  templateUrl: './shader-fire.component.html',
  styleUrls: ['./shader-fire.component.less']
})
export class ShaderFireComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new ShaderFire('#three')
  }

}


class ShaderFire extends Base{ 

  params = {
    velocity: 2,
  };

  colorParams = {
    color1: "#ff801a",
    color2: "#ff5718",
  };

  constructor(eleName:string){
    super(eleName)

    const camera = this.camera;
    camera.position.set(10,10,10);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);
    this.useCameraControls()

    this._init()


  } 

  
  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }

  _init(){

  }

  _createPlane(){
    const geometry =  new THREE.PlaneGeometry(2, 2, 100, 100);
    const material = new THREE.MeshBasicMaterial({color:'red'})
    const mesh = new THREE.Mesh(geometry,material)
    this.scene.add(mesh)
  }


}
