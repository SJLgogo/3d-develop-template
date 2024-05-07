import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import * as THREE from "three";
import { HaloMaterial } from "../../能量光环/Materials/HaloMaterial";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { SphereMaterial } from "../Material/vertex/material";
import { UniformInjector } from "src/app/routes/su7/kokomi/components/uniformInjector";
import { PointMaterial } from "../Material/point/material";
import {Stats} from 'src/app/routes/su7/kokomi/components/state'

export class Particles extends Base{
    
    am!:AssetManager;

    vertexMaterial:any;

    pointMaterial:any;

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

        new Stats(this)
        
        this.am.on('ready',()=> this._init())
    }


    _init(){
        this._createCircle()
        this._createPointCircle()
    }

    _createPointCircle(){
        const geometry = new THREE.SphereGeometry(2,32,32)
        const material:any = new PointMaterial()
        const uj = new UniformInjector(this)
        material.uniforms = {...material.uniforms , ...uj.shaderToyUnidorms}
        this.pointMaterial = material
        const mesh = new THREE.Points(geometry,material)
        mesh.position.set(5,0,0)
        this.scene.add(mesh)

        this.update((time:any)=>{
            uj.injectShadertoyUniforms(material.uniforms)
        })
    }


    _createCircle(){
        const geometry = new THREE.SphereGeometry(2,32,32)
        const material:any = new SphereMaterial()
        const uj = new UniformInjector(this)
        material.uniforms = {...material.uniforms , ...uj.shaderToyUnidorms}
        this.vertexMaterial = material
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