import * as THREE from "three"
import fragmentShader from './fragmentShader.glsl'
import vertexShader from './vertexShader.glsl'

export class SphereMaterial{
    constructor(){
        const material = new THREE.ShaderMaterial({
            uniforms:{

            },
            fragmentShader:fragmentShader,
            vertexShader:vertexShader
        })

        return material
    }
}