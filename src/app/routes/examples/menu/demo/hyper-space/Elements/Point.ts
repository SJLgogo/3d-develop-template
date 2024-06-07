import { Force3 } from "../../fire-ball/Class/Force3";

export class SpacePoint extends Force3 {

    constructor() {
        super()
    }

    time: number = 0

    size: number = 1;

    opacity = 0;

    is_active:boolean = false


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