import * as THREE from "three";
import vertexShader from '../glsl/vertexShader.glsl'
import fragmentShader from '../glsl/fragmentShader.glsl'
import { Point } from "./Point";
import { Util } from "../util/util";


export class Points {

    declare mesh: any;
    geometry: any;

    particleCount: number = 10000;

    positions = new Float32Array(this.particleCount * 3);
    colors = new Float32Array(this.particleCount * 3);
    sizes = new Float32Array(this.particleCount);

    moverList: Point[] = []

    last_time_activate = Date.now()


    gravity = new THREE.Vector3(0, 0.1, 0);


    constructor() {
    }

    initMesh() {
        const geometry = new THREE.BufferGeometry();
        for (let i = 0; i < this.particleCount; i++) {

            const mover = new Point()
            mover.init(new THREE.Vector3(Util.getRandomInt(-1, 1), 0, 0));
            this.moverList.push(mover)

            this.positions[i * 3] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            this.sizes[i] = mover.size;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1))
        this.geometry = geometry

        const material = new THREE.ShaderMaterial({
            uniforms: {},
            fragmentShader: fragmentShader,
            vertexShader: vertexShader
        })
        const mesh = new THREE.Points(geometry, material)
        this.mesh = mesh
    }


    load() {
        this.activateMover()
        this.updateMover()
    }

    // 设置粒子开始运动 , 增加粒子加速度
    activateMover() {
        let count = 0
        let now = Date.now();

        if (now - this.last_time_activate > 10) {
            for (let i = 0; i < this.particleCount; i++) {
                const mover = this.moverList[i]
                if (mover.is_active) continue;
                var rad1 = Util.getRadian(Math.log(Util.getRandomInt(0, 256)) / Math.log(256) * 260);
                var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
                var range = (1 - Math.log(Util.getRandomInt(32, 256)) / Math.log(256)) * 12;
                var force = Util.getPolarCoord(rad1, rad2, range);
                mover.activate();
                mover.applyForce(force);

                mover.a = 0.2;
                mover.size = Math.pow(12 - range, 2) * Util.getRandomInt(1, 24) / 100;
                count++;
                if (count >= 6) break;
            }
        }

        this.last_time_activate = Date.now();
    }


    /** 更新粒子速度  */
    updateMover() {
        for (var i = 0; i < this.moverList.length; i++) {
            var mover = this.moverList[i];
            if (mover.is_active) {
                mover.time++;
                mover.applyForce(this.gravity);  // 增加向上的加速度
                mover.updateVelocity();

                if (mover.time > 50) {
                    mover.size -= 0.7;
                    mover.a -= 0.009;
                }
                if (mover.a <= 0) {
                    // mover.init(new THREE.Vector3(0, 0, 0));
                    // mover.time = 0;
                    // mover.a = 0.0;
                    // mover.inactivate();
                }
            }
            this.positions[i * 3 + 0] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            this.sizes[i] = mover.size;
        }

        this.updatePoints();
    }


    updatePoints() {
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.attributes.size.needsUpdate = true;
    };


}