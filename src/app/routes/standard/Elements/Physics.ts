import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, ShapeType, Vec3, World } from "cannon-es";
import { Box3 } from "three";


interface Materials {
    default: Material
}

interface BodyConfig {
    mesh: THREE.Mesh
    shapeType: ShapeType
    mass: number
    type?: BodyType,
    scale?: number
}

export default class Physics {

    world: World;
    declare materials: Materials;


    constructor() {
        this.world = this.createWorld();
        this.materials = this.createMaterials();
        this.setGround()

   
    }

    private createWorld() {
        const world = new World()
        world.gravity.set(0, -982, 0)
        world.broadphase = new SAPBroadphase(world) // 设置（Broadphase）为 SAPBroadphase，这是一种高效的碰撞检测算法
        world.allowSleep = true // 允许物体在静止时休眠，以提高性能
        world.defaultContactMaterial.friction = 0 // 摩擦系数为 0

        return world
    }

    private createMaterials() {
        const materials = {
            default: new Material('default')
        }
        const defaultContactMaterial = new ContactMaterial(
            materials.default,
            materials.default,
            {
                friction: 0,  // 摩擦系数
                restitution: 0.2 // 恢复系数
            }
        );
        this.world.addContactMaterial(defaultContactMaterial)

        return materials
    }

    private setGround() {
        const ground = new Body({
            mass: 0,
            material: this.materials.default
        })
        ground.addShape(new Plane())
        ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);//旋转规律类似threejs 平面
        this.world.addBody(ground)
    }


    /** 创建刚体 */
    createBody(config: BodyConfig) {
        const body = new Body({
            mass: config.mass,
            material: this.materials.default,
            type: config.type || BODY_TYPES.DYNAMIC
        })
        const scale = config.scale ? config.scale : 1
        body.allowSleep = true
        // body.sleep()

        const box = new Box3().setFromObject(config.mesh)
        const { x, y, z } = config.mesh.position
        // console.log(box, config.mesh, scale);

        const size = new Vec3(
            (box.max.x - box.min.x) / 2,
            (box.max.y - box.min.y) / 2,
            (box.max.z - box.min.z) / 2
        )
        const center = new Vec3(
            (box.max.x + box.min.x) / 2 - x,
            (box.max.y + box.min.y) / 2 - y,
            (box.max.z + box.min.z) / 2 - z
        )

        body.position.copy(center)

        switch (config.shapeType) {
            // 圆柱体形状
            case SHAPE_TYPES.CYLINDER: {
                const radius = size.x
                const height = size.z
                const quaternion = new Quaternion()
                quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
                const shape = new Cylinder(radius, radius, height * 2, 12)
                body.addShape(shape, new Vec3(), quaternion)

                break
            }
            case SHAPE_TYPES.BOX: {
                const shape = new Box(size)
                body.addShape(shape, new Vec3())
                break
            }
        }

        body.addEventListener('collide', () => {
        })

        this.world.addBody(body)
        return body
    }


}