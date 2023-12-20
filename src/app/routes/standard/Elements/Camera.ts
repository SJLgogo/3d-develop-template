import { PerspectiveCamera, Vector3 } from "three";
import { gsap } from 'gsap'

const viewPosition = {
    default: new Vector3(1, 1, 1).normalize(),
}

// 1向量代表的相机位置 {x: 0.5773502691896258, y: 0.5773502691896258, z: 0.5773502691896258}

enum viewScalar {
    Loading = 300,
    Ready = 50,
}

export default class Camera {

    isReady: boolean = true
    declare main: PerspectiveCamera
    view: any;
    declare target: Vector3;


    constructor(width: number, height: number) {
        this.view = {
            position: viewPosition.default.clone(),
            scalar: viewScalar.Loading
        }
        this.target = new Vector3(60, 0, 0)
        const camera = new PerspectiveCamera(80, width / height, 0.01, 10000)
        camera.position.copy(this.view.position.clone().multiplyScalar(this.view.scalar))
        camera.lookAt(this.target);
        this.main = camera
    }


    ready(onComplete?: () => void) {
        gsap.to(this.view, { scalar: viewScalar.Ready, duration: 2, onComplete })
    }

    initUpdate() {
        this.main.position.copy(this.target).add(this.view.position.clone().multiplyScalar(this.view.scalar))
        // this.main.lookAt(this.target);
        // this.main.updateProjectionMatrix()
    }



}