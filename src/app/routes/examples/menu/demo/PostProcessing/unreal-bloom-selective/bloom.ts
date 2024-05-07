import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { RaycastSelector } from "src/app/routes/su7/kokomi/components/raycastSelector";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { CustomEffect } from "src/app/routes/su7/kokomi/postprocessing/customEffect";
import * as THREE from "three";
import * as dat from 'dat.gui';
import { BloomEffect } from "src/app/routes/su7/kokomi/postprocessing/bloomEffect";

export class Bloom extends Base {

  am: AssetManager;

  declare bloomEffect:BloomEffect;

  BLOOM_SCENE = 1;
  bloomLayer = new THREE.Layers();

  params={
    threshold: 0,  // 泛光阈值
    strength: 1,   // 泛光强度
    radius: 0.5,    // 泛光半径
  }

  constructor(eleName: string) {
    super(eleName)

    this.scene.background = new THREE.Color("black");

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

    this.bloomLayer.set( this.BLOOM_SCENE );


    this.bloomEffect =  new BloomEffect(this)

    this.useCameraControls()
    this._mountMouseClickEvent()

    this.am.on('ready', () => this._initReady())



  }

  _initReady() {
    this._addObject()
    this._initGui()

  }

  _addObject(){
  
    const geometry = new THREE.IcosahedronGeometry( 1, 15 );

    for ( let i = 0; i < 50; i ++ ) {

      const color = new THREE.Color();
      color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

      const material = new THREE.MeshBasicMaterial( { color: color } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = Math.random() * 10 - 5;
      sphere.position.y = Math.random() * 10 - 5;
      sphere.position.z = Math.random() * 10 - 5;
      sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 );
      sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
      this.scene.add( sphere );
      if ( Math.random() < 0.25 ) sphere.layers.enable( this.BLOOM_SCENE );
    }

  }

  _initGui() {
    const gui = new dat.GUI()
  	const bloomFolder = gui.addFolder( 'bloom' );

			bloomFolder.add( this.params, 'threshold', 0.0, 1.0 ).onChange(  ( value )=> {

				this.bloomEffect.bloomPass.threshold = Number( value );

			} );

			bloomFolder.add( this.params, 'strength', 0.0, 3 ).onChange(  ( value )=> {

				this.bloomEffect.bloomPass.strength = Number( value );

			} );

			bloomFolder.add( this.params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange(  ( value )=>  {

				this.bloomEffect.bloomPass.radius = Number( value );

			} );
  }

  _mountMouseClickEvent() {
    const raycastSelector = new RaycastSelector(this)
    this.renderer.domElement.addEventListener('click',()=>{
      const interSects =  raycastSelector.getInterSects()
      const object = interSects[0]?.object
      if(object){
					object.layers.toggle( this.BLOOM_SCENE );
      }
    })
  }

  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }

}