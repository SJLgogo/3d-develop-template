import * as THREE from 'three';
import * as lodash  from 'lodash';
import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, Sphere, Vec3, World } from "cannon-es";

export class CapsuleCollider
{
	public options: any;
	
	public body: Body;
	// public visual: THREE.Mesh;

	constructor(options: any , physics:any)
	{
		let defaults = {
			mass: 0,
			position: new Vec3(),
			height: 0.5,
			radius: 0.3,
			segments: 8,
			friction: 0.3
		};
		options =  lodash.defaults({},lodash.clone(options),defaults)
		this.options = options;


		let capsuleBody = new Body({
			mass: options.mass,
			position: options.position,
			material: physics.materials.default
		});

		// Compound shape
		let sphereShape = new Sphere(options.radius);
		sphereShape.material = physics.materials.default;


		capsuleBody.addShape(sphereShape, new Vec3(0, 30, 0));
		capsuleBody.addShape(sphereShape, new Vec3(0, options.height / 2, 0));
		capsuleBody.addShape(sphereShape, new Vec3(0, options.height - 30, 0));
		// capsuleBody.addShape(sphereShape, new Vec3(0, -options.height / 2, 0));

		console.log(capsuleBody);

		this.body = capsuleBody;
	}
}