import { AnimationMixer, Box3, CatmullRomCurve3, Clock, Group, Vector3 } from "three";
import Physics from "./Physics";
import { Body, Box, ConvexPolyhedron, Quaternion, RaycastResult, RaycastVehicle, SHAPE_TYPES, Sphere, Vec3 } from "cannon-es";
import { ShapeType, threeToCannon } from 'three-to-cannon';
import * as THREE from "three";
import * as  SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as TWEEN from '@tweenjs/tween.js';
import Queue from "../utiles/Queue";
import { CapsuleCollider } from "../physics/CapsuleCollider";

interface UserConfig {
    userId: string,
    physics: Physics,
    coordinate: number[]
}

export default class User {

    physics: Physics;

    declare model: any;

    declare characterBody: any;  // 刚体模型

    declare mixer: AnimationMixer;

    scale: number = 0.01;

    declare userId: string;

    controls: any

    declare coordinate: number[];

    declare tween: any;

    declare animateId: any;

    eventQueue: Queue = new Queue()

    declare resources: any;

    eventIsReady: boolean = true;

    createBodyTimer: any;

    characterCapsule:any;

	public declare raycastBox: THREE.Mesh;


    constructor(config: UserConfig, resources: any) {
        this.physics = config.physics
        this.userId = config.userId
        this.resources = resources
    }


    bulid(model: any, coordinate: number[]) {
        this.coordinate = coordinate
        this.model = SkeletonUtils.clone(model)
        this.model.name = this.userId
        this.model.position.set(...this.coordinate)
        this.editmodelSize()
        this.mixer = new AnimationMixer(this.model);
        this.gltfAnimation()
        this.createBody()
    }


    private editmodelSize(): void {
        this.model.scale.multiplyScalar(this.scale)
    }


    public gltfAnimation(): void {
        try {
            const animationClip = this.resources['man-stand-animation']
            const action = this.mixer.clipAction(animationClip);
            action.play();
        } catch (error) {
            console.error(error);
        }
    }


    update(deltaTime: any) {
        try {
            this.mixer.update(deltaTime);
            if (this.characterCapsule) {
                // const {x,y,z}=this.characterCapsule.body.position
                // this.model.position.copy(new Vec3(x, 0 ,z))
                // this.model.quaternion.copy(this.characterCapsule.body.quaternion);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /** 创建胶体模型 */
    createBody(){
        this.characterCapsule = new CapsuleCollider({
			mass: 1,
			position: new Vec3(10,1,0),
			height: 1,
			radius: 0.2,
			segments: 2,
			friction: 0.0
		});

        this.characterCapsule.body.allowSleep = false;
		this.characterCapsule.body.collisionFilterGroup = 2;
		this.characterCapsule.body.fixedRotation = true;
		this.characterCapsule.body.updateMassProperties();


        this.physics.world.addBody(this.characterCapsule.body);
    }

    physicsPreStep(body: Body, character: any): void
	{
		character.feetRaycast();

		// Raycast debug
		if (character.rayHasHit)
		{
			if (character.raycastBox.visible) {
				character.raycastBox.position.x = character.rayResult.hitPointWorld.x;
				character.raycastBox.position.y = character.rayResult.hitPointWorld.y;
				character.raycastBox.position.z = character.rayResult.hitPointWorld.z;
			}
		}
		else
		{
			if (character.raycastBox.visible) {
				character.raycastBox.position.set(body.position.x, body.position.y - character.rayCastLength - character.raySafeOffset, body.position.z);
			}
		}
	}

    /** 创建刚体模型 */
    createCharacterBody(): void {
        this.createBodyTimer = setTimeout(() => {
            const res: any = threeToCannon(this.model, { type: ShapeType.MESH });
            this.characterBody = new Body({ mass: 10, shape: res.shape, material: this.physics.materials.default });
            this.characterBody.position.set(...this.coordinate)
            this.characterBody.angularDamping = 0.9; // 调整这个值以控制阻尼，防止自旋转
            this.physics.world.addBody(this.characterBody)
            this.characterBody.addEventListener('collide', (event: any) => {
                console.log('人物碰撞', event);
            });
            this.createBodyTimer && clearTimeout(this.createBodyTimer)
        })
    }



    /** 两点移动 */
    twoPointMoveEvent(coordinate: number[]): void {
        this.eventIsReady = false

        const animate = () => {
            this.animateId = requestAnimationFrame(animate);
            TWEEN.update();
        }
        const end = new THREE.Vector3(...coordinate);
        this.tween = new TWEEN.Tween(this.characterBody.position)
            .to(end, 5000)
            .onStart(() => {
                this.editModelAniamte(this.resources['man-walk-animation'])
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.editModelAniamte(this.resources['man-stand-animation'])
                this.destoryTween()
                this.eventIsReady = true
            })
            .start();
        animate()
    }


    /** 路线移动 */
    lineMoveEvent(lineCoordinate: number[][]): void {
        this.eventIsReady = false

        const animate = () => {
            this.animateId = requestAnimationFrame(animate);
            TWEEN.update();
        }

        const curve: CatmullRomCurve3 = new CatmullRomCurve3(lineCoordinate.map((i: number[]) => new Vector3(...i)))
        const curvePath = new THREE.CurvePath();
        curvePath.add(curve);

        this.tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, 100000)
            .easing(TWEEN.Easing.Linear.None)
            .onStart(() => {
                this.editModelAniamte(this.resources['man-walk-animation'])
            })
            .onUpdate((e: any) => {
                this.changeUserPosition(curvePath, e)
                this.changeUserLookPoint(curvePath, e)
                this.setBodyDirection(curvePath, e)
            })
            .onComplete(() => {
                this.editModelAniamte(this.resources['man-stand-animation'])
                this.destoryTween()
                this.eventIsReady = true
            })
            .start();

        animate()
    }




    destoryTween(): void {
        this.tween = null;
        cancelAnimationFrame(this.animateId);
    }

    /** 修改动画 */
    private editModelAniamte(animationClip: any): void {
        const action = this.mixer.clipAction(animationClip);
        this.mixer.stopAllAction();
        action.play();
    }

    /** 改变模型位置 */
    changeUserPosition(curvePath: any, e: any): void {
        const position = curvePath.getPointAt(e.t);
        this.characterBody.position.copy(position);
    }

    /** 改变模型朝向 */
    changeUserLookPoint(curvePath: any, e: any): void {
        let direction = new Vector3()
        const position = curvePath.getPointAt(e.t);
        const tangent = curvePath.getTangentAt(e.t).normalize();
        direction.copy(tangent);
        this.model.lookAt(position.clone().add(direction));
    }

    /**  设置刚体模型的朝向*/
    setBodyDirection(curvePath: any, e: any): void {


    }

    /** 模型方向上增加力 */
    addPowerToModel(): void {
        const force = new Vec3(0, 0, -10);
        this.characterBody.applyForce(force, this.characterBody.position);
    }


    destory(): void {
        this.mixer.stopAllAction();
        this.model = null
    }





}