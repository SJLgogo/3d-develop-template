import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import {Util} from "../util/util";
import { Points } from "./Points";

export class Fire extends Base {


  points:any;


  constructor(ele: string) {
    super(ele)


    this.scene.background = new THREE.Color("#0b0b11");

    const camera = this.camera;
    camera.updateProjectionMatrix();
    const cameraPos = new THREE.Vector3(
      1000, 1000, 1000
    );
    camera.position.copy(cameraPos);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);

    this.useCameraControls();

    this._initSketch()

    this.update(() => this._render())
  }


  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }


  _initSketch() {
    const points = new Points();
    this.points = points
    points.initMesh()
    this.scene.add(points.mesh)
  }

  

  _render() {
    this.points.load()
  }



}