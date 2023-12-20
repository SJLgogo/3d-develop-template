import { MeshBasicMaterial } from "three";

export default class Material {

    constructor() {

    }

    // 1.MeshBasicMaterial 
    createMeshBasicMaterial(color: string = '#00acec'): MeshBasicMaterial {
        return new MeshBasicMaterial({
            color: color,
        })
    }

    // 2.MeshBasicMaterial - 材质
    createMeshBasicTextureMaterial(texture: any): MeshBasicMaterial {
        const mat = new MeshBasicMaterial()
        mat.map = texture
        return mat
    }

    // 设置三角网
    setWireframe(mat: MeshBasicMaterial): void {
        mat.wireframe = true
    }

    // 设置透明度
    setOpacity(mat: MeshBasicMaterial): void {
        mat.transparent = true
        mat.opacity = 0.5
    }




}