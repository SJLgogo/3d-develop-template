import { Body, Quaternion, Vec3 } from "cannon-es";
import Physics from "./Physics";
import { threeToCannon, ShapeType } from 'three-to-cannon';
import * as THREE from "three";
import { CollisionGroups } from "../../sketch/world/CollisionGroups";
import { BoxCollider } from "../physics/BoxCollider";
import { TrimeshCollider } from "../physics/TrimeshCollider";

export default class Station {

    declare physics: Physics;

    declare stationBody: any;

    main: any;


    constructor(physics: Physics) {
        this.physics = physics
    }

    build(modal: any): void {
        this.main = modal
        this.addBody(modal.clone())
    }

    
    addBody(model:any){
        model.traverse((child:any) => {
      
            if( child.name.includes('equipment') || child.name.includes('_Gate') || child.name.includes('_Safetydoor') || child.name=='立方体004' || child.name=='立方体003' || child.name.includes('elevator') || child.name.includes('stair') || child.name.includes('Fence')  || child.name.includes('obstacle')){
              let phys = new TrimeshCollider(child, {});
              phys.body && this.physics.world.addBody(phys.body);
            }

            if( child.name=='ground' || child.name=='立方体005'){
              let phys = new BoxCollider({size: new THREE.Vector3(child.scale.x, child.scale.y, child.scale.z)});
                      phys.body.position.copy(this.cannonVector(child.position));
                      phys.body.quaternion.copy(this.cannonQuat(child.quaternion));
                      if( phys.body.hasOwnProperty('computeAABB')){
                        phys.body.computeAABB()
                      }
      
                      phys.body.shapes.forEach((shape:any) => {
                        shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
                      });
      
                      this.physics.world.addBody(phys.body);
            }
      
          });
    }


    
    cannonVector(vec: THREE.Vector3): Vec3
    {
      return new Vec3(vec.x, vec.y, vec.z);
    }


    cannonQuat(quat: THREE.Quaternion): Quaternion
    {
        return new Quaternion(quat.x, quat.y, quat.z, quat.w);
    }

}