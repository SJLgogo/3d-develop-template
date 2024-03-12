import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, Vec3, World } from "cannon-es";

export interface ICollider {
	body: Body;
	
	// physical: CANNON.Body;
	// visual: THREE.Mesh;

	// getVisualModel(options: any): THREE.Mesh;
}