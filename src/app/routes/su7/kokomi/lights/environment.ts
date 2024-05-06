import * as THREE from "three";
import { Base } from "../Base/base";
import { Component } from "../components/component";

export class Environment extends Component {

    declare cubeRenderTarget: THREE.WebGLCubeRenderTarget;

    cubeCamera:THREE.CubeCamera;

    virtualScene:THREE.Scene;

    constructor(base: Base, config?: any) {
        super(base)

        const {
            resolution = 256,
            near = 1,
            far = 1000,
            scene = null,
            options = {}
        } = config;


        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(resolution, options);
        this.cubeRenderTarget = cubeRenderTarget;

        const cubeCamera = new THREE.CubeCamera(near , far ,cubeRenderTarget)
        this.cubeCamera = cubeCamera;

        const virtualScene = scene || new THREE.Scene();
        this.virtualScene = virtualScene;
    }


    update(time: number): void {
        this.cubeCamera.update(this.base.renderer, this.virtualScene);
    }

    get texture() {
        return this.cubeRenderTarget.texture;
    }

}