import * as THREE from "three";

export class Force3 {

    velocity = new THREE.Vector3();   // 速度
    acceleration = new THREE.Vector3();  // 加速度
    anchor = new THREE.Vector3();
    mass = 1;


    constructor() {

    }


    // 更新速度
    updateVelocity() {
        this.acceleration.divideScalar(this.mass);  // 加速度除以质量
        this.velocity.add(this.acceleration);
    };

    // 增加加速度
    applyForce(vector: THREE.Vector3) {
        this.acceleration.add(vector);
    };


    applyFriction(mu: number, normal: any) {
        var force = this.acceleration.clone();
        if (!normal) normal = 1;
        force.multiplyScalar(-1);
        force.normalize();
        force.multiplyScalar(mu);
        this.applyForce(force);
    };


    // 增加阻力
    applyDrag(value: number) {
        var force = this.acceleration.clone();  // 创建阻力向量，方向与加速度相反
        force.multiplyScalar(-1);
        force.normalize(); // 将阻力向量归一化，以保持方向不变但长度为1
        force.multiplyScalar(this.acceleration.length() * value);  // 根据阻力系数计算阻力大小并施加到物体上
        this.applyForce(force);
    };


    applyHook(rest_length: number, k: any) {
        var force = this.velocity.clone().sub(this.anchor);
        var distance = force.length() - rest_length;
        force.normalize();
        force.multiplyScalar(-1 * k * distance);
        this.applyForce(force);
    };
}