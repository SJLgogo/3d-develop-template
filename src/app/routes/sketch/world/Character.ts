import * as THREE from "three";
import { CapsuleCollider } from "./CapsuleCollider";
import { Body, Box, Material, RaycastResult, Sphere, Vec3 } from 'cannon-es';
import { SktechWorld } from "./World";
import { CollisionGroups } from "../enums/CollisionGroups";

export class Character extends THREE.Object3D{

    animations:any[]=[]

    mixer:any;

    declare world:SktechWorld;

     tiltContainer: THREE.Group;
	 modelContainer: THREE.Group;

     raycastBox:any;
     characterCapsule:any;

     public defaultVelocitySimulatorDamping: number = 0.8;
     public defaultVelocitySimulatorMass: number = 50;

	public charState: any;



	// Ray casting
	public rayResult: RaycastResult = new RaycastResult();
	public rayHasHit: boolean = false;
    public rayCastLength: number = 0.57;
	public raySafeOffset: number = 0.03;


    constructor(gltf:any){
        super()

		this.setAnimations(gltf.animations);  // 设置动画


		this.tiltContainer = new THREE.Group();
        this.add(this.tiltContainer);
		this.modelContainer = new THREE.Group();
		this.modelContainer.position.y = -0.57;
		this.tiltContainer.add(this.modelContainer);
		this.modelContainer.add(gltf.scene);

        this.mixer = new THREE.AnimationMixer(gltf.scene);

        this.characterCapsule = new CapsuleCollider({
			mass: 1,
			position: new Vec3(),
			height: 0.5,
			radius: 0.25,
			segments: 8,
			friction: 0.0
		});
		this.characterCapsule.body.shapes.forEach((shape:any) => {
			shape.collisionFilterMask = 1;
		});
	
		this.characterCapsule.body.allowSleep = false;
		this.characterCapsule.body.collisionFilterGroup = 2;
		this.characterCapsule.body.fixedRotation = true;
		this.characterCapsule.body.updateMassProperties();

        // Ray cast debug
        const boxGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const boxMat = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        this.raycastBox = new THREE.Mesh(boxGeo, boxMat);
		

    }

    public feetRaycast(): void
	{
		let body = this.characterCapsule.body;
		// console.log(body.position);
		
		const start = new Vec3(body.position.x, body.position.y, body.position.z);
		const end = new Vec3(body.position.x, body.position.y, body.position.z+ 0.3 );


		const rayCastOptions = {
			collisionFilterMask: 1,  
			skipBackfaces: true      /* ignore back faces */
		};
		this.rayHasHit = this.world.physicsWorld.raycastClosest(start, end, rayCastOptions, this.rayResult);
	}


    public setAnimations(animations: []): void
	{
		this.animations = animations;
	}

	public addToWorld(world:any): void
	{

			// Set world
			this.world = world;

			this.step(world)

			// Register character
			world.physicsWorld.addBody(this.characterCapsule.body);

			world.scene.add(this);  // 模型本身
			world.scene.add(this.raycastBox);


			this.create()
		
	}

	step(world:any){
		world.physicsWorld.addEventListener('preStep', (event:any)=> {
			this.feetRaycast();
			if (this.rayHasHit)
			{
				if (this.raycastBox.visible) {
					this.raycastBox.position.x = this.rayResult.hitPointWorld.x;
					this.raycastBox.position.y = this.rayResult.hitPointWorld.y;
					this.raycastBox.position.z = this.rayResult.hitPointWorld.z;
				}
			}
			else
			{
				if (this.raycastBox.visible) {
					const body = this.characterCapsule.body
					this.raycastBox.position.set(body.position.x, body.position.y - this.rayCastLength - this.raySafeOffset, body.position.z);
				}
			}
		});
		
		// 监听每个模拟步骤后的事件
		world.physicsWorld.addEventListener('postStep', (event:any)=> {
			this.characterCapsule.body.velocity.x = 0;
			this.characterCapsule.body.velocity.y = 0;
			this.characterCapsule.body.velocity.z = 2;
			if(this.rayHasHit){
				this.characterCapsule.body.velocity.x = -2;
				this.characterCapsule.body.velocity.y = 0;
				this.characterCapsule.body.velocity.z = 2;
			}
		});
	}


	detectMovement(){

	}



	create(){
			const halfExtents = new Vec3(1, 1, 1); // 正方体的边长为 2
			const boxShape = new Box(halfExtents);
			const boxBody = new Body({ mass: 0 });
			boxBody.addShape(boxShape); 
			boxBody.position.set(0, 0, 5); 
			this.world.physicsWorld.addBody(boxBody);
	}

	update(){
		this.position.copy(this.characterCapsule.body.position);
		this.quaternion.copy(this.characterCapsule.body.quaternion);
	}

}