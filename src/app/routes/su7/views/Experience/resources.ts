import { LoaderType } from "src/app/routes/standard/utiles/Loader";

export default [
    { name: 'car', type: LoaderType.GLTF, path: 'assets/su7/sm_car.gltf' },
    { name: 'sm_startroom', type: LoaderType.GLTF, path: 'assets/su7/sm_startroom.raw.gltf' },
    { name: 'ut_car_body_ao', type: LoaderType.Texture, path: 'assets/su7/texture/t_car_body_AO.raw.jpg' },
    {
        name: "ut_env_night",
        type: LoaderType.HDR,
        path: "assets/su7/texture/t_env_night.hdr",
      },
      {
        name: "ut_env_light",
        type: LoaderType.HDR,
        path: "assets/su7/texture/t_env_light.hdr",
      },
]