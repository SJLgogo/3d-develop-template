import { LoaderType } from "../utiles/Loader";

export default [
    { name: 'man', type: LoaderType.FBX, path: 'assets/userModal/man.fbx' },
    { name: 'man-walk-animation', type: LoaderType.FBX, path: 'assets/animation/man/walking.fbx' },
    { name: 'scene_background', type: LoaderType.HDR, path: 'assets/hdr/1.hdr' },
    { name: 'model-car', type: LoaderType.GLTF, path: 'assets/models/car.glb'},
    { name: 'station', type: LoaderType.GLTF, path: 'assets/glb/osp3.glb' },
    { name: 'metro', type: LoaderType.GLTF, path: 'assets/glb/metro.glb' },
]