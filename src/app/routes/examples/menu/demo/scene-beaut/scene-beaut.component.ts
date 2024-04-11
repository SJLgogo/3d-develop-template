import { Component, OnInit } from '@angular/core';
import { LoaderType } from 'src/app/routes/standard/utiles/Loader';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { AssetManager } from 'src/app/routes/su7/kokomi/components/assetManager';
import { OrbitControls } from 'src/app/routes/su7/kokomi/controls/orbitControls';
import { flatModel, getEnvmapFromHDRTexture } from 'src/app/routes/su7/kokomi/utils/misc';
import * as THREE from 'three';
import { EffectComposer, RenderPass } from 'three-stdlib';
import * as POSTPROCESSING from 'postprocessing';

@Component({
  selector: 'app-scene-beaut',
  templateUrl: './scene-beaut.component.html',
  styleUrls: ['./scene-beaut.component.less']
})
export class SceneBeautComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Demo('#three')
  }

}


class Demo extends Base {

  am: AssetManager;

  constructor(ele: string) {
    super(ele)

    new OrbitControls(this);

    this.scene.background = new THREE.Color("#0b0b11");

    const camera = this.camera as THREE.PerspectiveCamera;
    camera.updateProjectionMatrix();
    const cameraPos = new THREE.Vector3(
      -318.77438399405463, 103.00048254218594, -471.581556865478
    );
    camera.position.copy(cameraPos);
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);

    const am = new AssetManager(this, {
      resources: [
        { name: 'car', type: LoaderType.GLTF, path: 'assets/sketch/source/car.glb' },
        { name: 'hdr', type: LoaderType.HDR, path: "assets/sketch/source/env.hdr", },
      ]
    })
    this.am = am

    this.am.on('ready', () => {

      const envMap = getEnvmapFromHDRTexture(this.renderer, am.resources["hdr"]);
      this.scene.environment = envMap;


      const model = this.am.resources['car'].scene
      model.position.set(0, 0, 0)
      this.scene.add(model)

      const modelParts = flatModel(model);

      modelParts.forEach((item: any) => {
        if (item.material) {
          // emissive
          item.material.toneMapped = false;
          item.material.emissiveIntensity = 50;

          // envmap
          item.material.envMapIntensity = 0.5;
        }
      });

      const createPostprocessing = ()=>{
        const composer = new POSTPROCESSING.EffectComposer(this.renderer, {
          frameBufferType: THREE.HalfFloatType,
          multisampling: 8,
        });
        this.composer = composer;

        composer.addPass(
          new POSTPROCESSING.RenderPass(this.scene, this.camera)
        );

        const bloom = new POSTPROCESSING.BloomEffect({
          blendFunction: POSTPROCESSING.BlendFunction.ADD,
          mipmapBlur: true,
          luminanceThreshold: 1,
        });

        const smaa = new POSTPROCESSING.SMAAEffect();
        const effectPass = new POSTPROCESSING.EffectPass(
          this.camera,
          bloom,
          // ssr,
          smaa
        );
        composer.addPass(effectPass);

        this.renderer.autoClear = true;
      };

      createPostprocessing();



    })




  }



}