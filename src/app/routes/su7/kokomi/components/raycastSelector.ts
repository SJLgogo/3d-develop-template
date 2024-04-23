import * as THREE from "three";
import { Base } from "../Base/base";
import { Component } from "./component";

export class RaycastSelector extends Component{
  raycaster: THREE.Raycaster;

    constructor(base:Base){
        super(base)

        this.raycaster = new THREE.Raycaster()
    }

    // 获取点击物
    getInterSects(targets = this.container.children){
        this.raycaster.setFromCamera(this.base.interactionManager.mouse, this.base.camera);
        const intersects = this.raycaster.intersectObjects(targets, true);
        console.log('点击位置的三维坐标:', intersects[0]?.point);
        return intersects;
    }



}