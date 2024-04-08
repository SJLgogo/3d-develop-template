import { Base } from "../Base/base";
import { Component } from "../components/component";
import CameraControlsTmpl from 'camera-controls'
import * as THREE from "three";

export class CameraControls extends Component{

    controls:CameraControlsTmpl;

    constructor(base:Base){
        super(base)

        CameraControlsTmpl.install({ THREE });

        const controls= new CameraControlsTmpl(
            base.camera ,
            base.renderer.domElement
        )

        this.controls = controls;
    }


    update(time:number){
        this.controls.update(this.base.clock.deltaTime)
    }


}