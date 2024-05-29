import * as THREE from "three";
import { Force3 } from "./Force3";

export class Point extends Force3 {

    is_active = false;

    time: number = 0

    size:number=1;

    opacity = 0;

    constructor() {
        super()
    }

    init(vector: any) {
        this.velocity = vector.clone();
        this.anchor = vector.clone();
        this.acceleration.set(0, 0, 0);
        this.time = 0;
    }

    activate() {
        this.is_active = true;
    }

    inactivate(){
        this.is_active = false;
    }
}