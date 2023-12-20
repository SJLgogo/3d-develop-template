import { BoxGeometry, MeshBasicMaterial, Mesh, CanvasTexture, PlaneGeometry, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import Physics from "./Physics";
import { Body, SHAPE_TYPES, Sphere, Vec3 } from "cannon-es";
import createShielMaterial from '../materials/createShieldMaterial'
import debounce from '../utiles/debounce'
import { gsap } from 'gsap'
import { vertexShader, fragmentShader } from '../glsl/glsl'
import { from } from "rxjs";
import * as TWEEN from '@tweenjs/tween.js';


export default class CustomCube {

    model: any;

    characterBody: any;

    declare physics: Physics

    material: any;

    stoppingDistance: number = 1.0 // 停止施加力的阈值

    declare towPointBodyMoveCb: () => void;

    constructor(physics: Physics) {
        this.physics = physics
        this.material = createShielMaterial()
    }


    build(): void {
        const geometry = new SphereGeometry(1, 32, 32)
        const material = new MeshBasicMaterial({
            color: 0xffffff,
        });
        this.model = new Mesh(geometry, material);

        this.characterBody = this.createCircleBody()
        this.characterBody.position.set(50, 50, -5)
        // this.characterBody.collisionResponse = false; // 禁用初始碰撞
        this.physics.world.addBody(this.characterBody)

        this.characterBody.addEventListener('collide', (event: any) => {
            console.log('碰撞', event);
        });

        // this.bodyTwoPointMoveByPosition()
    }

    update(): void {
        this.model.position.copy(this.characterBody.position);
        this.model.quaternion.copy(this.characterBody.quaternion);

        // this.towPointBodyMoveCb && this.towPointBodyMoveCb()
    }

    createCircleBody(): any {
        var radius = 1; // 球体的半径
        var sphereShape = new Sphere(radius);
        var sphereBody = new Body({ mass: 0.9, shape: sphereShape, material: this.physics.materials.default });
        return sphereBody
    }


    /** 刚体模型实现两点移动 */
    bodyTwoPointMoveByForce(): void {
        const end = new Vector3(10, 50, 0);
        const forceMagnitude = 5;
        const force = new Vec3(end.x, end.y, end.z).scale(forceMagnitude);
        this.characterBody.applyForce(force, this.characterBody.position);


        this.towPointBodyMoveCb = () => {
            // const distance = new Vector3().copy(new Vector3(100, 50, 0)).sub(this.model.position).length()
            const distance = this.characterBody.position.distanceTo(new Vector3(10, 50, 0));
            console.log(distance);
            if (distance < this.stoppingDistance) {
                this.bodyVelocityStop()
            }
        }

    }


    /** 修改刚体模型坐标移动刚体 */
    bodyTwoPointMoveByPosition(): void {
        const animate = () => {
            requestAnimationFrame(animate);
            TWEEN.update();
        }
        const end = new Vector3(100, 0, 0);
        new TWEEN.Tween(this.characterBody.position)
            .to(end, 10000)
            .onStart(() => {
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
            })
            .start();

        animate()
    }


    /** 刚体模型停止 */
    bodyVelocityStop(): void {
        this.characterBody.velocity.set(0, 0, 0);
    }


}







/**
 * 红色区域代码: 
 * 
 * 
    private show = debounce(() => {
        gsap.timeline()
            .to(this.material.uniforms.uHeight, { value: 10.0, duration: .5 })
            .to(this.material.uniforms.uHeight, { value: .0, duration: 2 })
    }, 3000)


    returnCanvasTexture(): any {
        const canvas2d = document.createElement('canvas');
        canvas2d.width = 100;
        canvas2d.height = 100;
        const ctx = canvas2d.getContext('2d');
        if (ctx) {
            const grd = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
            grd.addColorStop(0, 'rgba(255,255,255,1');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 100, 100);
        }

        return new CanvasTexture(canvas2d);
    }


    customShader(): any {
        const material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        return material
    }
 * 
 */