import fragmentShader from "./glsl/fra.glsl";
import vertexShader from "./glsl/ver.glsl";

import * as THREE from "three";

export class Points {

    declare geometry: THREE.BufferGeometry;

    declare mesh: THREE.Points;

    moversNum: number = 10000;

    positions = new Float32Array(this.moversNum * 3);

    constructor() {
        this.initParticle()
    }


    // 初始化粒子系统
    initParticle() {
        for (var i = 0; i <= this.moversNum; i++) {
            this.positions[i * 3] = Math.random()*100;
            this.positions[i * 3 + 1] =  Math.random()*100;
            this.positions[i * 3 + 2] =  Math.random()*100;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.geometry = geometry

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
            },
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        })
        const mesh = new THREE.Points(geometry, material)
        this.mesh = mesh
    }
}