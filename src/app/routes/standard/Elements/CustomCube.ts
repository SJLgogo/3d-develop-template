import { BoxGeometry, MeshBasicMaterial, Mesh, CanvasTexture, PlaneGeometry, ShaderMaterial, SphereGeometry, Vector3, Vector2, CylinderGeometry } from "three";
import Physics from "./Physics";
import { Body, Quaternion, SHAPE_TYPES, Sphere, Vec3 } from "cannon-es";
import createShielMaterial from '../materials/createShieldMaterial'
import debounce from '../utiles/debounce'
import { gsap } from 'gsap'
import { vertexShader, fragmentShader } from '../glsl/glsl'
import { from } from "rxjs";
import * as TWEEN from '@tweenjs/tween.js';
import { PhysicalBody } from "./PhysicalBody";


export default class CustomCube{

    movePath:any[]=[
        {x: 976.5903624549146 , z:-71},
        {x: 1500.5903624549146 , z:-71},
        {x:3000, z:-366},
        {x:3300, z:-366},
    ]

    // 200, 630 , -20

    moveTargetIdx = 0

    forceMagnitude:number = 100

    model: any;

    characterBody: any;

    declare physics: Physics

    material: any;

    targetPoint = new Vec3();

    declare towPointBodyMoveCb: () => void;

    declare physicalBody:PhysicalBody;

    isMoving:boolean =false

    startTime:any;


    constructor(physics: Physics) {
        this.physics = physics
        this.physicalBody = new PhysicalBody({
            physics:physics
        })
        this.material = createShielMaterial()
    }


    build(config:any): void {
        const position = config.position
        this.movePath = config.movePath
        // const geometry = new CylinderGeometry(25, 25, 100, 20); // 参数分别为：顶部半径，底部半径，高度，圆柱体的面数
        const geometry = new SphereGeometry(25, 32, 32)
        const material = this.customShader()
        this.model = new Mesh(geometry, material);
        this.physicalBody.createBody(position)
    }

    update(): void {
        if(this.physicalBody?.hasBody()){
            this.model.position.copy(this.physicalBody.getPosition());
            this.model.quaternion.copy(this.physicalBody.getQuaternion());
            this.movePath?.length && this.moveUpdate()
        }
    }
    moveUpdate(): void {
        var endTime;
        if (this.isMoving == false && this.moveTargetIdx == 0 && this.movePath.length) {
            this.startTime = Date.now();
            this.addForce()
            return
        }

        if (this.movePath.length == 0 || this.moveTargetIdx > this.movePath.length || this.isMoving == false) return

        // console.log(this.physicalBody.body.position.x  , this.physicalBody.body.position.z , Math.abs(this.physicalBody.body.position.x - this.movePath[this.moveTargetIdx].x) , Math.abs(this.physicalBody.body.position.z - this.movePath[this.moveTargetIdx].z));

        if (Math.abs(this.physicalBody.body.position.x - this.movePath[this.moveTargetIdx].x) <= 100 && Math.abs(this.physicalBody.body.position.z - this.movePath[this.moveTargetIdx].z) <= 100 ) {
            // console.log('到达一个点', this.physicalBody.body.position);
            // console.log('结束',this.physicalBody);
            endTime = Date.now();
            const elapsedTime = endTime - this.startTime!
            // console.log(`执行时间: ${elapsedTime} 毫秒`);
            this.moveTargetIdx++
            this.physicalBody.stop()

            if (this.moveTargetIdx <= this.movePath.length - 1) {
                this.addForce()
            } else {
                this.isMoving = false
            }
        }
    }

    addForce(): void {
        this.isMoving = true
        const speedMagnitude = 100
        const forceMagnitude = 4000; // 力的大小
        const currentPos = new Vector2(this.physicalBody.body.position.x, this.physicalBody.body.position.z);
        const nextPos = new Vector2(this.movePath[this.moveTargetIdx].x, this.movePath[this.moveTargetIdx].z);
        const direction = nextPos.clone().sub(currentPos).normalize();

        // const force = new Vec3(direction.x * forceMagnitude, 0, direction.y * forceMagnitude); // 构造力向量
        // this.physicalBody.body.applyForce(force, this.physicalBody.body.position)

        // 直接设置物理体的速度
        const velocity = new Vec3(direction.x * speedMagnitude, 0, direction.y * speedMagnitude);
        this.physicalBody.body.velocity.set(velocity.x, velocity.y, velocity.z);
       
    }

    createCircleBody(): any {
        var radius = 1; // 球体的半径
        var sphereShape = new Sphere(radius);
        var sphereBody = new Body({ mass:1, shape: sphereShape, material: this.physics.materials.default });
        return sphereBody
    }


    /** 刚体模型暂停 */
    stop():void{
        // 清除物体上的所有力和扭矩
        this.physicalBody.body.force.set(0, 0, 0);
        this.physicalBody.body.torque.set(0, 0, 0);
        // 将速度和角速度都设置为零
        this.physicalBody.body.velocity.set(0, 0, 0);
        this.physicalBody.body.angularVelocity.set(0, 0, 0);
    }


    customShader(): any {
        const material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        return material
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


   
 * 
 */