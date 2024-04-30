import * as THREE from "three"
import fragmentShader from './fragmentShader.glsl'
import vertexShader from './vertexShader.glsl'

export class PointMaterial{
    constructor(){
        const material = new THREE.ShaderMaterial({
            uniforms:{
            },
            fragmentShader:fragmentShader,
            vertexShader:vertexShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })

        return material
    }
}