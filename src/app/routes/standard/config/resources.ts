import { LoaderType } from "../../su7/kokomi/components/assetManager";

export default [
    { name: 'man', type: LoaderType.FBX, path: 'assets/userModal/man.fbx' },
    { name: 'man-walk-animation', type: LoaderType.FBX, path: 'assets/animation/man/walking.fbx' },
    { name: 'scene_background', type: LoaderType.HDR, path: 'assets/hdr/1.hdr' },
    { name: 'model-car', type: LoaderType.GLTF, path: 'assets/models/car.glb'},
    { name: 'station', type: LoaderType.FBX, path: 'assets/sketch/HZDD.fbx' },
    { name: 'metro', type: LoaderType.GLTF, path: 'assets/glb/metro.glb' },
    { name: 'levelNav', type: LoaderType.GLTF, path: 'assets/glb/level.nav.glb' },
    { name: 'demo', type: LoaderType.GLTF, path: 'assets/glb/demo2.glb' },
]