import * as THREE from "three";
import { Component } from "../../../kokomi/components/component";
import { flatModel, printModel } from "../../../kokomi/utils/misc";
import Experience from "../Experience";
import * as STDLIB from "three-stdlib";

export class Car extends Component{

    declare base:Experience;

    model:any;

    modelParts:THREE.Object3D[]

    bodyMat!: THREE.MeshStandardMaterial;

    constructor(base:Experience){
        super(base)

        const model = this.base.am.resources['car'] as STDLIB.GLTF
        this.model = model

        const modelParts = flatModel(model.scene);
        printModel(modelParts,'carParts')
        this.modelParts = modelParts;

        this.handleModel();
    }   


    handleModel(){
        const body = this.modelParts[2] as THREE.Mesh;
        console.log(body);
        const bodyMat = body.material as THREE.MeshStandardMaterial;
        this.bodyMat = bodyMat;
        bodyMat.color = new THREE.Color("#26d6e9");


        this.modelParts.forEach((item: any) => {
            if (item.isMesh) {
              const mat = item.material as THREE.MeshStandardMaterial;
              mat.aoMap = this.base.am.resources['ut_car_body_ao']
            }
          });
    }

    addExisting() {
        this.container.add(this.model.scene);
    }

    setBodyEnvmapIntensity(value: number) {
        if (this.bodyMat) {
          this.bodyMat.envMapIntensity = value;
        }
    }

}