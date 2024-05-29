import * as THREE from "three";
import { Force3 } from "./Force3";
import { Util } from "../util/util";

export class ForcePointLight extends THREE.PointLight {

    force: Force3;

    constructor(hex: any, intensity: number, distance: number, decay: number) {
        super(hex, intensity, distance, decay);

        this.force = new Force3();
    }

    updatePosition() {
        this.position.copy(this.force.velocity);
    }
    setPolarCoord(rad1: any, rad2: any, range: any) {
        this.position.copy(Util.getPolarCoord(rad1, rad2, range));
    }
}