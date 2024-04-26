import { LoaderType } from "src/app/routes/standard/utiles/Loader";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager } from "src/app/routes/su7/kokomi/components/assetManager";
import * as THREE from "three";
import { HaloMaterial } from "../../能量光环/Materials/HaloMaterial";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { SphereMaterial } from "../Material/material";
import { UniformInjector } from "src/app/routes/su7/kokomi/components/uniformInjector";

export class Particles extends Base{
    
    am!:AssetManager;

    material:any;

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
        ]})
        this.am = am

        this.useCameraControls()
        
        this.am.on('ready',()=> this._init())
    }


    _init(){
        this._createCircle()
    }


    _createCircle(){
        const geometry = new THREE.SphereGeometry(2,32,32)
        const material:any = new SphereMaterial()
        const uj = new UniformInjector(this)
        material.uniforms = {...material.uniforms , ...uj.shaderToyUnidorms}
        this.material = material
        const mesh = new THREE.Mesh(geometry,material)
        this.scene.add(mesh)

        this.update((time:any)=>{
            uj.injectShadertoyUniforms(material.uniforms)
        })
    }


    useCameraControls(){
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0.8, 0);
    }
}