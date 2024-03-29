import * as THREE from 'three';
import {Object3D} from 'three';
import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, Vec3, World } from "cannon-es";
import { ShapeType, threeToCannon } from 'three-to-cannon';
import * as CANNON from 'cannon-es';

export class TrimeshCollider
{
	public mesh: any;
	public options: any;
	public body: any;
	public debugModel: any;

	constructor(mesh: Object3D, options: any)
	{
		this.init(mesh)
	}

	init(mesh:Object3D){
		this.mesh = mesh.clone();

		let defaults = {
			mass: 0,
			position: mesh.position,
			rotation: mesh.quaternion,
			friction: 0
		};
		this.options = defaults;
		

		let result:any= threeToCannon(this.mesh, {type: ShapeType.MESH});

		if (result && result.shape) {
			// result.shape.collisionFilterMask = 2;
			let physBox:any = new CANNON.Body({
				mass: this.options.mass,
				position: this.options.position,
				quaternion: this.options.rotation,
			});
			physBox.name = mesh.name
			physBox.addShape(result.shape);
		
			// 如果返回结果中包含偏移量，确保也应用这个偏移量
			if (result.offset) {
				result.shape.position.copy(result.offset);
			}

			// console.log(physBox);
		
			this.body = physBox;
		}
		

		// Add phys sphere
		// let physBox = new CANNON.Body({
		// 	mass: options.mass,
		// 	position: options.position,
		// 	quaternion: options.rotation,
		// 	shape: result.shape as any as CANNON.Shape
		// });

		// this.body = physBox;
	}
}