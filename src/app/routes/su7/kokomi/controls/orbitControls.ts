import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Component } from "../components/component";
import { Base } from "../Base/base";

export interface OrbitControlsConfig{
    enableDamping: boolean;
}


export class OrbitControls extends Component{

    declare controls:OrbitControlsImpl;

    constructor(base:Base , config:Partial<OrbitControlsConfig> ={}){

        super(base)

        const {enableDamping=true} = config

        const controls = new OrbitControlsImpl(
            base.camera,
            base.renderer.domElement
        )
        this.controls = controls
        controls.enableDamping = enableDamping;
    }

}   