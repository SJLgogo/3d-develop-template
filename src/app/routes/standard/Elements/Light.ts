import { AmbientLight, HemisphereLight, PointLight, Scene } from "three";

export default class Light {

    declare scene: Scene

    constructor(scene: Scene) {
        this.scene = scene
        this.createPointLight()
        // this.createAmbientLight()
        // this.createHemisphereLight()
    }

    // 创建点光源
    createPointLight(): void {
        const pointLight = new PointLight(0xffffff, 1, 0);
        pointLight.position.set(0, 1000, 0);
        this.scene.add(pointLight);
    }

    // 创建环境光
    createAmbientLight(): void {
        const ambientLight = new AmbientLight(0xffffff); // soft white light
        this.scene.add(ambientLight);
    }

    // 创建场景光
    createHemisphereLight(): void {
        const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemisphereLight);
    }

}