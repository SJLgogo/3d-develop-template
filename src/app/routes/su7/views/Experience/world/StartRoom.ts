import * as THREE from "three";
import { Component } from "../../../kokomi/components/component";
import { flatModel } from "../../../kokomi/utils/misc";
import Experience from "../Experience";

export class StartRoom extends Component{

    base!:Experience;

    model:any;

    lightMat:THREE.MeshStandardMaterial;

    constructor(base:Experience){
        super(base)

        const model = this.base.am.resources['sm_startroom']
        this.model = model;

        const modelParts = flatModel(model.scene)

        const light001 = modelParts[1] as THREE.Mesh
        const lightMat = light001.material as THREE.MeshStandardMaterial  // 基于PRB的标准材质类型
        this.lightMat = lightMat;
        lightMat.emissive = new THREE.Color("white");  // 设置发光颜色
        lightMat.emissiveIntensity = 1;  // 设置自发光强度
        lightMat.toneMapped = false;    // 禁用色调映射，材质的颜色将直接显示原始的颜色值。
        lightMat.transparent = true;   // 透明
        this.lightMat.alphaTest = 0.1;

        console.log(modelParts);

    }


    addExisting(){
        
        this.base.scene.add(this.model.scene)
    }
}