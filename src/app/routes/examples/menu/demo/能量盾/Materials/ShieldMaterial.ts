import * as THREE from "three";
import fragmentShader from './frag.glsl'
import vertexShader from './vert.glsl'

export default class ShieldMaterial{


    constructor(){

        const material:THREE.ShaderMaterial = new THREE.ShaderMaterial({
            uniforms:{
                uThickneww:{value:0},
                uNoiseTexture:{value:null},
                uColor:{value:new THREE.Color('red')},
                uTime:{value:0}
            },
            fragmentShader:fragmentShader,
            vertexShader:vertexShader,

            // 设置透明
            transparent:true,
            blending:THREE.AdditiveBlending
        })

        return material

    }


}