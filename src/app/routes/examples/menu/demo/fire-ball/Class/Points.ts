import * as THREE from "three";
import vertexShader from '../glsl/vertexShader.glsl'
import fragmentShader from '../glsl/fragmentShader.glsl'
import { Point } from "./Point";
import { Util } from "../util/util";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { Fire } from "./Fire";


export class Points extends Component {

    declare mesh: any;
    geometry: any;

    particleCount: number = 10000;

    positions = new Float32Array(this.particleCount * 3);
    colors = new Float32Array(this.particleCount * 3);
    sizes = new Float32Array(this.particleCount);
    opacities = new Float32Array(this.particleCount);

    moverList: Point[] = []

    last_time_activate = Date.now()

    gravity = new THREE.Vector3(0, 0.1, 0);

    base: Fire;

    constructor(base: Fire) {
        super(base)
        this.base = base
    }

    initMesh() {
        const geometry = new THREE.BufferGeometry();
        for (let i = 0; i < this.particleCount; i++) {

            const mover = new Point()
            mover.init(new THREE.Vector3(Util.getRandomInt(-1, 1), 0, 0));
            this.moverList.push(mover)

            var h = Util.getRandomInt(0, 45);
            var s = Util.getRandomInt(60, 90);
            var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');
            color.toArray(this.colors, i * 3);


            this.positions[i * 3] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            this.opacities[i] = mover.opacity;
            this.sizes[i] = mover.size;
        }
        geometry.setAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        geometry.setAttribute('vertexOpacity', new THREE.BufferAttribute(this.opacities, 1));
        geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1))
        this.geometry = geometry

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                // FireImg: { value: this.base.am.resources['fire'] },
                FireImg: { value: this.createTexture()},
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


    createTexture() {
        var canvas = document.createElement('canvas');
        var ctx: any = canvas.getContext('2d');
        var grad = null;
        var texture = null;

        canvas.width = 200;
        canvas.height = 200;
        grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
        ctx.fill();

        texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        return texture;
    };


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
                var vector = new THREE.Vector3();
                var force = Util.getPolarCoord(rad1, rad2, range);
                vector.add(new THREE.Vector3(0, 0, 0));
                mover.activate();
                mover.init(vector);
                mover.applyForce(force);
                mover.opacity = 0.4;
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

                if (mover.time > 30) {
                    mover.size -= 0.7;
                    mover.opacity -= 0.009;
                }
                if (mover.size <= 0) {
                    mover.init(new THREE.Vector3(0, 0, 0));
                    mover.time = 0;
                    mover.opacity = 0.0;
                    // mover.inactivate();
                }
            }
            this.positions[i * 3 + 0] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            this.opacities[i] = mover.opacity;
            this.sizes[i] = mover.size;
        }

        this.updatePoints();
    }


    updatePoints() {
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.attributes.size.needsUpdate = true;
        this.mesh.geometry.attributes.vertexOpacity.needsUpdate = true;
        this.mesh.geometry.attributes.customColor.needsUpdate = true;
    };


}