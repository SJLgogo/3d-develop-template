import { Body } from "cannon-es";
import Physics from "./Physics";
import { threeToCannon, ShapeType } from 'three-to-cannon';

export default class Station {

    declare physics: Physics;

    declare stationBody: any;

    main: any;


    constructor(physics: Physics) {
        this.physics = physics
    }

    build(modal: any): void {
        this.main = modal

        // const res: any = threeToCannon(this.main, { type: ShapeType.MESH });
        // this.stationBody = new Body({ mass: 1, shape: res.shape, material: this.physics.materials.default });
        // this.stationBody.position.set(0, 0, 0)
        // this.physics.world.addBody(this.stationBody)
    }


}