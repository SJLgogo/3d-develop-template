import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import * as THREE from "three";

export class Grid extends Component{

    gridHelper:THREE.GridHelper;

    plane:THREE.Mesh;

    objects:THREE.Mesh[]=[]


    constructor(base:Base){
        super(base)

        
        const gridHelper = new THREE.GridHelper( 1000, 20 );
        this.gridHelper = gridHelper


        const geometry = new THREE.PlaneGeometry( 1000, 1000 );
        geometry.rotateX( - Math.PI / 2 );
        this.plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    }


    addExisting() {
        this.base.scene.add(this.gridHelper)
        this.base.scene.add(this.plane)
        this.objects.push( this.plane );
    }
}