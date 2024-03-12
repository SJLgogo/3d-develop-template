import { Body, Sphere } from "cannon-es";
import Physics from "./Physics";

interface PhysicalBodyConfig{
    physics:Physics
}

export class PhysicalBody{


    body:any;

    declare physics:Physics

    constructor(config:PhysicalBodyConfig){
        this.physics = config.physics
    }

    
    /** 创建刚体模型 */
    createBody(position:number[]):void{
        this.body = this.createCircleBody()
        this.setPosition(position[0],position[1],position[2])
        this.addBodyToPhysics()
        // this.collideListener()
    }

    /** 增加到物理世界 */
    addBodyToPhysics():void{
        this.physics.world.addBody(this.body)
    }

    /** 设置初始位置 */
    setPosition(x:number,y:number,z:number):void{
        this.body.position.set(x, y,z)
    }

    /** 碰撞检测 */
    collideListener():void{
        this.body.addEventListener('collide', (event: any) => {
             
        });
    }

    /** 创建球体 */
    createCircleBody(): any {
        var radius = 50; 
        var sphereShape = new Sphere(radius);
        var sphereBody = new Body({ mass: 0.5, shape: sphereShape, material: this.physics.materials.default });
        return sphereBody
    }

    getPosition():any{
        return this.body.position
    }

    getQuaternion():any{
        return this.body.quaternion
    }

    hasBody():boolean{
        return this.body ? true : false
    }

    destory():void{

    }

     /** 刚体模型停止移动 */
    stop(): void {
        this.body.force.set(0, 0, 0);
        this.body.torque.set(0, 0, 0);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
    }




}