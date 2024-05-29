import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { Util } from "../util/util";
import { Points } from "./Points";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
export class Fire extends Base {

  points: any;

   am: AssetManager;

  constructor(ele: string) {
    super(ele)


    this.scene.background = new THREE.Color("#0b0b11");

    const camera = this.camera;
    camera.updateProjectionMatrix();
    const cameraPos = new THREE.Vector3(
      100, 100, 100
    );
    camera.position.copy(cameraPos);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);

    this.useCameraControls();

    // this.createBackground()

    const am = new AssetManager(this, {
      resources: [
        { name: 'fire', type: LoaderType.Texture, path: 'assets/images/fire.png' },
      ]
    })
    this.am = am;

    this.am.on('ready', () => {
      this._initSketch()
      this.update(() => this._render())
    })


  }

  createBackground () {
    var geometry = new THREE.OctahedronGeometry(1500, 3);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        side: THREE.BackSide
    });
    const bg = new THREE.Mesh(geometry, material);
    this.scene.add(bg);
};


  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }


  _initSketch() {
    const points = new Points();
    this.points = points
    points.initMesh(this)
    this.scene.add(points.mesh)
  }

  _render() {
    this.points.load()
  }


}