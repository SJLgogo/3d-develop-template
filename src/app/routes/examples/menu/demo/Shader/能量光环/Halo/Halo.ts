import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager, LoaderType } from "src/app/routes/su7/kokomi/components/assetManager";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import { OrbitControls } from "src/app/routes/su7/kokomi/controls/orbitControls";
import * as THREE from "three";
import { HaloMaterial } from "../Materials/HaloMaterial";

export default class Halo extends Base{

    am!:AssetManager;

    material:any;

    constructor(ele:string){
        super(ele)

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
        this._createLine()

        this.update((time:any)=>{
            this.material.uniforms.uTime = time
        })
    }

    _createLine(){
        const points = [
            new THREE.Vector3(-10, 0, 0),
            new THREE.Vector3(-15, 15, 20),
            new THREE.Vector3(5, -15, 0),
            new THREE.Vector3(10, 0, 10)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const curveMaterial:any = new HaloMaterial();
        this.material = curveMaterial
        const curveObject = new THREE.Line(curveGeometry, curveMaterial);
        this.scene.add(curveObject);
    }

    useCameraControls(){
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0.8, 0);
    }
}