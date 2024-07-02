import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import * as THREE from "three";

export class RollOverMesh extends Component{

    model:THREE.Mesh;

    constructor(base:Base){
        super(base)

        const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
        const rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        this.model = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    }


    addExisting(){
        this.container.add(this.model);
    }

}