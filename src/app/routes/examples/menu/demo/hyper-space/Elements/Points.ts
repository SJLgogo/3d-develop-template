import * as THREE from "three";
import { Util } from "../../fire-ball/util/util";
import { SpacePoint } from "./Point";
import fragmentShader from '../glsl/fra.glsl'
import vertexShader from '../glsl/ver.glsl'
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { HyperSpace } from "../hyperSpace";
import { Force3 } from "../../fire-ball/Class/Force3";

export class Points extends Force3 {

    moversNum: number = 30000
    movers: SpacePoint[] = []
    positions = new Float32Array(this.moversNum * 3);
    colors = new Float32Array(this.moversNum * 3);
    opacities = new Float32Array(this.moversNum);
    sizes = new Float32Array(this.moversNum);

    geometry: any;
    mesh: any;

    last_time_activate = Date.now()
    gravity = new THREE.Vector3(1.5, 0, 0);


    constructor() {
        super()
    }


    init() {
        for (var i = 0; i <= this.moversNum; i++) {
            var mover = new SpacePoint()
            var h = Util.getRandomInt(60, 210);
            var s = Util.getRandomInt(30, 90);
            var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

            mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
            this.movers.push(mover);
            this.positions[i * 3] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            color.toArray(this.colors, i * 3);
            this.opacities[i] = mover.opacity;
            this.sizes[i] = mover.size;
        }
        this.initPoints()
    }

    initPoints() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        geometry.setAttribute('vertexOpacity', new THREE.BufferAttribute(this.opacities, 1));
        geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1))
        this.geometry = geometry

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                imgTexture : { value : this.createTexture()}
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

    createTexture = function() {
        var canvas = document.createElement('canvas');
        var ctx :any= canvas.getContext('2d');
        var grad = null;
        var texture = null;
    
        canvas.width = 256;
        canvas.height = 256;
        grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(128, 128, 128, 0, Math.PI / 180, true);
        ctx.fill();
    
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

    update() {
        this.activateMover()
        this.updateMover()
    }


    activateMover() {
        let count = 0
        let now = Date.now();

        if (now - this.last_time_activate > this.gravity.x * 16) {
            for (var i = 0; i < this.movers.length; i++) {
                const mover = this.movers[i]
                if (mover.is_active) continue

                // 设置球的位置
                var rad = Util.getRadian(Util.getRandomInt(0, 120) * 3);
                var range = Math.log(Util.getRandomInt(2, 128)) / Math.log(128) * 160 + 60;
                var y = Math.sin(rad) * range;
                var z = Math.cos(rad) * range;
                const vector = new THREE.Vector3(-1000, y, z)
                vector.add(this.velocity);
                mover.init(vector)
                mover.activate()

                // 透明度
                mover.opacity = 0;

                // 大小
                mover.size = Util.getRandomInt(5, 60);

                count++;
                // 控制marker分开移动
                if (count >= Math.pow(this.gravity.x * 6, this.gravity.x * 0.4)) break;
            }
            this.last_time_activate = Date.now();
        }
    }

    updateMover() {
        for (var i = 0; i < this.movers.length; i++) {
            const mover = this.movers[i]
            if (mover.is_active) {
                mover.applyForce(this.gravity);
                mover.applyDrag(0.1);
                mover.updateVelocity();

                if (mover.opacity < 0.8) {
                    mover.opacity += 0.2;
                }
            }
            if (mover.velocity.x > 1000) {
                mover.init(new THREE.Vector3(0, 0, 0));
                mover.opacity = 0
                mover.inactivate()
            }

            this.positions[i * 3 + 0] = mover.velocity.x;
            this.positions[i * 3 + 1] = mover.velocity.y;
            this.positions[i * 3 + 2] = mover.velocity.z;
            this.opacities[i] = mover.opacity;
            this.sizes[i] = mover.size;
        }
        this.updatePoints();
    };


    updatePoints() {
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.attributes.size.needsUpdate = true;
        this.mesh.geometry.attributes.vertexOpacity.needsUpdate = true;
        this.mesh.geometry.attributes.customColor.needsUpdate = true;
    };

}