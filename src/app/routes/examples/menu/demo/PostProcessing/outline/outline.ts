import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { RaycastSelector } from "src/app/routes/su7/kokomi/components/raycastSelector";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { CustomEffect } from "src/app/routes/su7/kokomi/postprocessing/customEffect";
import * as THREE from "three";
import * as dat from 'dat.gui';
import {Stats} from 'src/app/routes/su7/kokomi/components/state'

export class Outline extends Base {

  am: AssetManager;

  customEffect: CustomEffect;

  gui:any;

  outLineParams = {
    edgeStrength: 3.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    visibleEdgeColor: '#ffffff',
    hiddenEdgeColor : '#190a05',
  }

  constructor(eleName: string) {
    super(eleName)

    this.scene.background = new THREE.Color("#0b0b11");

    const camera = this.camera as THREE.PerspectiveCamera;
    camera.updateProjectionMatrix();
    const cameraPos = new THREE.Vector3(
      0, 0, 8
    );
    camera.position.copy(cameraPos);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);

    const am = new AssetManager(this, {
      resources: [
        { name: 'tree', type: LoaderType.OBJ, path: 'assets/models/obj/tree.obj' },
      ]
    })
    this.am = am

    this.customEffect = new CustomEffect(this)
    this.customEffect.addOutLinePass()
    this.customEffect.addExisting()

    new Stats(this)

    this.useCameraControls()
    this._mountMouseMoveEvent()

    this.am.on('ready', () => this._initReady())


  }

  _initReady() {

    this._addObject()
    this._initLight()
    // this._initGui()

  }

  _addObject(){
    const object = this.am.resources['tree']
    let scale = 1.0;
    object.traverse(( child:any )=> {
      if ( child instanceof THREE.Mesh ) {
        child.geometry.center();
        child.geometry.computeBoundingSphere();
        scale = 0.2 * child.geometry.boundingSphere.radius;

        const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 5 } );
        child.material = phongMaterial;
        child.receiveShadow = true;
        child.castShadow = true;
      }

    } );

    object.position.y = 1;
    object.scale.divideScalar( scale );
    this.scene.add(object)

    
    const group = new THREE.Group()
    const geometry = new THREE.SphereGeometry( 3, 48, 24 );

    for ( let i = 0; i < 20; i ++ ) {
      const material = new THREE.MeshLambertMaterial();
      material.color.setHSL( Math.random(), 1.0, 0.3 );
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = Math.random() * 4 - 2;
      mesh.position.y = Math.random() * 4 - 2;
      mesh.position.z = Math.random() * 4 - 2;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.scale.multiplyScalar( Math.random() * 0.3 + 0.1 );
      group.add( mesh );
    }
    this.scene.add(group)
  }

  _initGui() {
    const gui = new dat.GUI()
    this.gui = gui;
    gui.add(this.outLineParams, 'edgeStrength', 0, 10).onChange((value) => {
      this.customEffect.outlinePass.edgeStrength = Number(value);
    });
    gui.add(this.outLineParams, 'edgeGlow', 0, 10).onChange((value) => {
      this.customEffect.outlinePass.edgeGlow = Number(value);
    });
    gui.add(this.outLineParams, 'edgeThickness', 0, 10).onChange((value) => {
      this.customEffect.outlinePass.edgeThickness = Number(value);
    });
    gui.add(this.outLineParams, 'pulsePeriod', 0, 10).onChange((value) => {
      this.customEffect.outlinePass.pulsePeriod = Number(value);
    });
  }


  _initLight() {
    this.scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.6 ) );
    const light = new THREE.DirectionalLight(0xddffdd, 2);
    light.position.set(1, 1, 1);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light)
  }

  _mountMouseMoveEvent() {
    const raycastSelector = new RaycastSelector(this)
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.domElement.addEventListener('pointermove', (e) => {
      const intersect = raycastSelector.getFirstIntersect()
      const select = []
      if (intersect) {
        select.push(intersect.object)
        this.customEffect.outlinePass.selectedObjects = select
      }
    })
  }

  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }

}