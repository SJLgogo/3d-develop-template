import * as THREE from "three";
import { Base } from "../Base/base";
import { Component } from "../components/component";

class FBO extends Component{
    
    width?: number;
    height?: number;

    rt:THREE.WebGLRenderTarget

    constructor(base:Base , config:any= {}){
        super(base)

        const { width, height, samples = 0, depth = false, options = {} } = config;
        this.width = width;
        this.height = height;

        const rt = new THREE.WebGLRenderTarget(
            this.actualWidth,
            this.actualHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                type: THREE.HalfFloatType,
                ...options,
              }
        )

        this.rt = rt


        if(depth){
            rt.depthTexture = new THREE.DepthTexture(
                this.actualWidth,
                this.actualHeight,
                THREE.FloatType
            )
        }

        if (samples) {
            rt.samples = samples;
        }

    }

    get actualWidth() {
        return this.width || window.innerWidth * window.devicePixelRatio;
    }

    get actualHeight() {
        return this.height || window.innerHeight * window.devicePixelRatio;
    }

}


export {FBO}