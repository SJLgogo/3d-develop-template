import { Base } from "../Base/base";
import { Component } from "./component";

export class UniformInjector extends Component {

    declare base:Base;

    shaderToyUnidorms:{[key:string] : any};

    constructor(base:Base){

        super(base)

        this.shaderToyUnidorms ={
            iTime:{value:0},  
            iTimeDelta:{value:0}
        }

    }


    injectShadertoyUniforms(uniforms:any = this.shaderToyUnidorms){
        uniforms.iTime.value = this.base.clock.elapsedTime
        uniforms.iTimeDelta.value = this.base.clock.deltaTime
    }
}