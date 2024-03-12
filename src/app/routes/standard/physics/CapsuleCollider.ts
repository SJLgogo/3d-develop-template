import * as THREE from 'three';
import * as lodash  from 'lodash';
import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, Sphere, Vec3, World } from "cannon-es";

export class CapsuleCollider
{
	public options: any;
	
	public body: Body;
	// public visual: THREE.Mesh;

	constructor(options: any)
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
		console.log(options);
		this.options = options;


		let capsuleBody = new Body({
			mass: options.mass,
			position: options.position
		});

		// Compound shape
		let sphereShape = new Sphere(options.radius);


		capsuleBody.addShape(sphereShape, new Vec3(0, 0, 0));
		capsuleBody.addShape(sphereShape, new Vec3(0, options.height / 2, 0));
		capsuleBody.addShape(sphereShape, new Vec3(0, -options.height / 2, 0));

		this.body = capsuleBody;
	}
}