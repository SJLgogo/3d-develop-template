import { BoxGeometry, Group, Mesh } from "three";
import Material from "./CustomMaterial";

export default class BatchCrowd extends Material {

    main: Group = new Group();

    baseY: number = 0.19977886820527146


    constructor() {
        super()
    }

    build(crowdList: number[][], resources: any): void {
        for (let i = 0; i < crowdList.length; i++) {
            this.main.add(this.createOneCrowd(crowdList[i], resources))
        }
    }

    private createOneCrowd(params: number[], resources: any): Mesh {
        const geometry = new BoxGeometry(0.8, this.baseY, 0.8);
        const material = this.createMeshBasicTextureMaterial(resources['crowd_' + params[2]])
        // this.setOpacity(material)
        const model = new Mesh(geometry, material);
        model.position.set(params[0] + 0.4, this.baseY, -params[1] + 0.4)
        return model
    }




}