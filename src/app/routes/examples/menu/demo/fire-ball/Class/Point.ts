import * as THREE from "three";

export class Point {

    is_active = false;

    velocity: any = new THREE.Vector3();

    acceleration = new THREE.Vector3();  // 加速度

    time: number = 0

    size:number=0;

    mass = 1

    a =0;

    constructor() {

    }

    init(vector: any) {
        this.velocity = vector.clone();
    }

    activate() {
        this.is_active = true;
    }

    inactivate(){
        this.is_active = false;
    }

    applyForce(vector: any) {
        this.acceleration.add(vector);
    };


    updateVelocity() {
        this.acceleration.divideScalar(this.mass);
        this.velocity.add(this.acceleration);
      };
}