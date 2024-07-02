import { Component, OnInit } from '@angular/core';
import { ParticleTransform } from './ParticleTransformation';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { AssetManager } from 'src/app/routes/su7/kokomi/components/assetManager';
import { Points } from 'three';
import { CameraControls } from 'three-stdlib';
import * as THREE from 'three';

@Component({
  selector: 'app-particle-transformation',
  templateUrl: './particle-transformation.component.html',
  styleUrls: ['./particle-transformation.component.less']
})
export class ParticleTransformationComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
    new ParticleTransform('#three');
  }

}


export class ParticleTransform1 extends Base {


  constructor(eleName: string) {
      super(eleName)

      this.scene.background = new THREE.Color("#0b0b11");

  }

}