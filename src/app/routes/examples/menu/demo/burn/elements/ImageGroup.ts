import * as THREE from "three";
import { ImageMesh } from "./Image";
import { easeInOutQuad } from "src/app/routes/su7/kokomi/utils/misc";
const DURATION = 3;

export class ImageGroup extends THREE.Group {

    timeTransition: number = 0

    declare image: ImageMesh

    constructor() {
        const progress = 0.5;
        super()
        this.name = 'ImageGroup';
    }

    start(noiseTex: THREE.Texture, imgTexes: THREE.Texture[]) {
        const image = new ImageMesh();
        image.start(noiseTex, imgTexes)
        this.image = image

        this.add(image);
    }


    update(time: number) {
        this.timeTransition += time;

        // 翻页
        if (this.timeTransition / DURATION >= 1) {
            this.timeTransition = 0;
            this.image.changeTex();
        } else {
            const easeStep = easeInOutQuad(Math.min(this.timeTransition / DURATION, 1.0));  // 动画
            // console.log(this);
            this.image?.update(time, easeStep);
        }
    }


    resize(camera: any, resolution: THREE.Vector2) {
        const height = Math.abs(
            (camera.position.z - this.position.z) * Math.tan(this.mathExRadians(camera.fov) / 2) * 2
        );
        const width = height * camera.aspect;

        const margin = new THREE.Vector2()
        margin.set(
            (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.x * 0.1,
            (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.y * 0.333
        );
        const size = new THREE.Vector3()

        size.set(
            width * (resolution.x - margin.x) / resolution.x,
            height * (resolution.y - margin.y) / resolution.y,
            1
        );
        this.image.resize(size);
    }

    mathExRadians(degrees: number) {
        return degrees * (Math.PI / 180);
    }
}

