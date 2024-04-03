import { LoaderType } from "src/app/routes/standard/utiles/Loader";

export default [
    { name: 'car', type: LoaderType.GLTF, path: 'assets/su7/sm_car.gltf' },
    { name: 'ut_car_body_ao', type: LoaderType.Texture, path: 'assets/su7/texture/t_car_body_AO.raw.jpg' },
    // { name: 'man-walk-animation', type: LoaderType.FBX, path: 'assets/animation/man/walking.fbx' },
    // { name: 'scene_background', type: LoaderType.HDR, path: 'assets/hdr/1.hdr' },
    // { name: 'model-car', type: LoaderType.GLTF, path: 'assets/models/car.glb'},
    // { name: 'station', type: LoaderType.FBX, path: 'assets/sketch/HZDD.fbx' },
    // { name: 'metro', type: LoaderType.GLTF, path: 'assets/glb/metro.glb' },
    // { name: 'levelNav', type: LoaderType.GLTF, path: 'assets/glb/level.nav.glb' },
    // { name: 'demo', type: LoaderType.GLTF, path: 'assets/glb/demo.glb' },
]