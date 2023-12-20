import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import Material from "./CustomMaterial";

export default class Crowd extends Material {

    declare model: any

    constructor() {
        super()
    }

    build(resources: any): void {
        const geometry = new BoxGeometry(10, 0, 10);
        const material = this.createMeshBasicTextureMaterial(resources['color_Texture']);
        this.setOpacity(material)
        this.model = new Mesh(geometry, material);
        this.model.position.set(5, 5, 5)
    }
}