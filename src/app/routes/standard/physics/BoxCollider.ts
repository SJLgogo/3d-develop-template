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


		let shape:any = new CANNON.Box(options.size);

		if (shape) {
			let physBox = new CANNON.Body({
				mass: options.mass,
				position: options.position,
				shape:shape
			});
			this.body = physBox;
		}
		
	}
}