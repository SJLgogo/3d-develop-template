import { Body, Sphere } from "cannon-es";
import Physics from "./Physics";
import * as Cannon from 'cannon-es';
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
        this.body.addEventListener('collide', (event: any , score: boolean) => {
            // console.log('碰撞检测' , event );

            if(event.contact.bj.name == 'user'){
                console.log('碰撞法线方向上的相对速度:' , event.contact.getImpactVelocityAlongNormal());
                const contactNormal = event.contact.ni;   // 获取碰撞的法向量
                const collisionDirection = contactNormal.negate();  // 碰撞的方向即为法向量的反方向
                console.log('碰撞方向:', collisionDirection);
            }
        });
    }

    /** 创建柱状体 */
    createCylinderBody(){
        const radius = 25; // 圆柱体半径
        const height = 100; // 圆柱体高度
        const cylinderShape = new Cannon.Cylinder(radius, radius, height, 20);
        const cylinderBody = new Cannon.Body({
            mass: 0.5, // 物体质量
            shape: cylinderShape ,// 使用圆柱体的形状
            material: this.physics.materials.default,
            fixedRotation :true
        });
        return cylinderBody
    }


    /** 创建球体 */
    createCircleBody(): any {
        var radius = 25; 
        var sphereShape = new Sphere(radius);
        // sphereShape.collisionFilterMask = 1; 
        // sphereShape.collisionResponse=false
        var sphereBody:any= new Body({ mass: 100, shape: sphereShape, material: this.physics.userMaterials.default });
        sphereBody.name='user'
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