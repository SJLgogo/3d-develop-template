import * as TWEEN from '@tweenjs/tween.js';
import { Vector3 } from 'three';
import * as  SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

export default class Metro {

    model: any;

    tween: any;

    declare initPosition: Vector3;

    tweenCompleteFn: () => void = () => {
        this.tween = null
    };

    constructor(initPosition: Vector3) {
        this.initPosition = initPosition
    }


    build(model: any): void {
        // this.model = model
        this.model = SkeletonUtils.clone(model)
        this.model.position.set(this.initPosition.x, this.initPosition.y, this.initPosition.z)

    }

    update(): void {
        TWEEN.update()
    }


    createTween(target: Vector3): void {
        const tween = new TWEEN.Tween(this.model.position)
            .to(target, 5000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
            })
            .onComplete(() => this.tweenCompleteFn());
        this.tween = tween
        this.tween.start()
    }



}