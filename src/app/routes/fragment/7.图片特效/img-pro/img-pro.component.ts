import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import * as THREE from 'three';

@Component({
  selector: 'app-img-pro',
  templateUrl: './img-pro.component.html',
  styleUrls: ['./img-pro.component.less']
})
export class ImgProComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new ImgPro('#three')
  }

}


class ImgPro extends Base{

  constructor(eleName:string){
    super(eleName)

    const camera = this.camera;
    camera.position.copy(new THREE.Vector3(100,100,100))
    camera.lookAt(0,0,0)

  }


}