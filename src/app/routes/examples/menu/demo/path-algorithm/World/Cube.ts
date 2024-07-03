import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import { CatmullRomCurve3 } from "three";

export class Cube extends Component {

    model: THREE.Mesh;

    tween: any;

    constructor(base: Base) {
        super(base)

        const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c });
        const model = new THREE.Mesh(cubeGeo, cubeMaterial);

        this.model = model
    }

    addExisting() {
        this.base.scene.add(this.model)
    }


    move(path:number[][]) {
        if(this.tween){
            this.tween.stop();
        }

        const curve: CatmullRomCurve3 = new CatmullRomCurve3(path!.map((i: number[]) => new THREE.Vector3(...i)))
        const curvePath = new THREE.CurvePath();
        curvePath.add(curve);

        const newTween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, 5000)
            .easing(TWEEN.Easing.Linear.None)
            .onStart(() => {
            })
            .onUpdate((e: any) => {
                this.changeUserPosition(curvePath, e)
            })
            .onComplete(() => {

            })
            .start();
        this.tween = newTween;    
    }

    update(time: number): void {
        this.tween?.update();
    }

    /** 改变模型位置 */
    changeUserPosition(curvePath: any, e: any): void {
        const position = curvePath.getPointAt(e.t);
        this.model?.position.copy(position);
    }

}   