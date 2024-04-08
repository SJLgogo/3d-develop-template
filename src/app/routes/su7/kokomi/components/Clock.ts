import * as THREE from "three";
import { Base } from "../Base/base";
import { Component } from "./component";

export class Clock extends Component{

    clock:THREE.Clock;

    deltaTime:number = 0
    elapsedTime:number = 0

    constructor(base:Base){
        super(base)

        const clock = new THREE.Clock()
        this.clock = clock

        this.deltaTime = 0
        this.elapsedTime = 0
    }

    update(time: number): void {
        const newElapsedTime = this.clock.getElapsedTime();
        const deltaTime = newElapsedTime - this.elapsedTime;
        this.deltaTime = deltaTime;
        this.elapsedTime = newElapsedTime;
        this.emit("tick");
    }
}