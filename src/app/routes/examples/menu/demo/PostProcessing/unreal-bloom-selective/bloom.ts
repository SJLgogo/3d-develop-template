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

  materials:any={};

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
      10,10, 8
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


    this.bloomEffect =  new BloomEffect(this  , {
      materials:this.materials,
      bloomLayer:this.bloomLayer
    })

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
      if(Math.random()<0.25) sphere.layers.enable( this.BLOOM_SCENE );  // 启用了球体对象在“BLOOM_SCENE”场景中的显示
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
      const object:any= interSects[0]?.object
      if(object){
					object.layers.toggle( this.BLOOM_SCENE ); // 切换对象在“BLOOM_SCENE”场景中的显示状态
      }
    })
  }

  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }

}



/**
 * 使用bloomPass实现泛光思路 : 
 * 
 * 1.首先创建BloomPass对象 ，负责计算泛光效果
 * 2.将bloomPass对象添加到泛光的EffectComposer (将带有泛光效果的场景渲染结果传递给第二个 EffectComposer) EffectComposer.renderToScreen = false
 * 3.使用第二个 EffectComposer 渲染场景
 * 
 */


/**
 * 
 * 问 : 
 * 其实使用单个composer也能渲染出bloomPass效果 ，但使用两个composer可以即实现泛光也可以实现某些元素不泛光 ， 是这样吗
 * 答：
    虽然使用单个 EffectComposer 也可以实现 Bloom Pass 效果，但是使用两个 EffectComposer 可以更加灵活地控制场景中不同元素的泛光效果。
    使用单个 EffectComposer 应用 Bloom Pass 时，整个场景中的所有元素都会受到泛光效果的影响，
    而使用两个 EffectComposer 则可以实现对不同元素的不同处理，即一些元素受到泛光效果的影响，而另一些元素则不受影响。
    比如，在第一个 EffectComposer 中应用 Bloom Pass，将带有泛光效果的场景渲染结果传递给第二个 EffectComposer，然后在第二个 EffectComposer 中再次渲染整个场景，但不应用 Bloom Pass，这样就可以实现一些元素不受泛光效果影响的效果。
    因此，使用两个 EffectComposer 可以提供更加灵活和精细的控制，使得在同一个场景中可以实现不同元素的不同渲染效果。
*/