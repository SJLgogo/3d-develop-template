import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export class BoxCollider 
{
	public options: any;
	public body:any;
	public debugModel: any;
	
	constructor(options: any)
	{
		let defaults = {
			mass: 0,
			position: new THREE.Vector3(),
			size: new THREE.Vector3(0.3, 0.3, 0.3),
			friction: 0.3
		};
		
		options = {...defaults , ...options};

		options.position = new CANNON.Vec3(options.position.x, options.position.y, options.position.z);
		options.size = new CANNON.Vec3(options.size.x, options.size.y, options.size.z);

		// let mat = new CANNON.Material('boxMat');
		// mat.friction = options.friction;
		// mat.restitution = 0.7;

		let shape:any = new CANNON.Box(options.size);
		// shape.material = mat;

		console.log(shape);

		// Add phys sphere
		let physBox = new CANNON.Body({
			mass: options.mass,
			position: options.position,
			shape:shape
		});

		console.log(physBox);
		
		
		this.body = physBox;
	}
}