import * as THREE from "three";
import fragShader  from './frag.glsl'
import vertexShader  from './vert.glsl'


export class HaloMaterial{
    

    constructor(){
        const material = new THREE.ShaderMaterial({
            uniforms:{
                uTime:{value:0}
            },
            vertexShader:vertexShader,
            fragmentShader:fragShader,
            transparent:true
        })

        return material
    }

}