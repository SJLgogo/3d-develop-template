import resources from "src/app/routes/standard/config/resources";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { OrbitControls } from "src/app/routes/su7/kokomi/controls/orbitControls";
import * as THREE from "three";
import ShieldMaterial from "../Materials/ShieldMaterial";
import * as dat from 'dat.gui';
import { getEnvmapFromHDRTexture } from "src/app/routes/su7/kokomi/utils/misc";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";

export default class Shield extends Base{


    am:AssetManager;

    declare material:THREE.ShaderMaterial;


    constructor(ele:string){
        super(ele)
        this.scene.background = new THREE.Color('black')
        const camera = this.camera
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            10,10,10
        );
        camera.position.copy(cameraPos);

        const am = new AssetManager(this,{resources:[
            { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
            { name: 'car', type: LoaderType.GLTF, path: 'assets/sketch/source/car.glb' },
            { name: 'noise' , type:LoaderType.Texture ,path:'assets/images/noise.png' }
        ]})
        this.am = am

        this.useCameraControls()
        
        this.am.on('ready',()=> this._init())

        this.update((time:number)=>this._shaderUpdate(time))
    }

    _init(){
        this._createEnvirment()
        this._createHelper()
        this._createPlayer()
        this._createShield()
        this._createDebug()
    }


    _createHelper(){
        const gridHelper = new THREE.GridHelper()
        this.scene.add(gridHelper)
    }

    _createPlayer(){
        const model = this.am.resources['car'].scene
        model.scale.set(0.01,0.01,0.01)
        this.scene.add(model)
    }

    _createShield(){

        const texture = this.am.resources['noise']
        texture.wraps = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping

        const geometry = new THREE.SphereGeometry(3,32,32)
        const material:any= new ShieldMaterial()
        material.uniforms.uNoiseTexture.value = texture
        this.material = material
        const mesh = new THREE.Mesh(geometry , material)
        mesh.position.set(0,1,0)
        this.scene.add(mesh)
    }

    _createDebug(){
        const gui = new dat.GUI();
        const energyFolder = gui.addFolder('Energy Shield')
        energyFolder.add(this.material.uniforms.uThickneww,'value').min(0).max(10).step(0.01).name('uThickneww')
        gui.addColor(this.material.uniforms.uColor,'value').name('uColor')

        energyFolder.open()
    }

    _createEnvirment(){
        const envMap = getEnvmapFromHDRTexture(this.renderer, this.am.resources["hdr"]);
        this.scene.environment = envMap;
    }


    _shaderUpdate(time:any){
        this.material && (this.material.uniforms.uTime.value = time)
    }


    useCameraControls(){
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0.8, 0);
    }


}