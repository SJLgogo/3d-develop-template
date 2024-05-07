import { Component, OnDestroy, OnInit } from '@angular/core';
import { Base } from 'src/app/routes/su7/kokomi/Base/base';
import { AssetManager, LoaderType } from 'src/app/routes/su7/kokomi/components/assetManager';
import { OrbitControls } from 'src/app/routes/su7/kokomi/controls/orbitControls';
import { flatModel, getEnvmapFromHDRTexture } from 'src/app/routes/su7/kokomi/utils/misc';
import * as THREE from 'three';
import { EffectComposer, RenderPass } from 'three-stdlib';
import * as POSTPROCESSING from 'postprocessing';
import { CameraControls } from 'src/app/routes/su7/kokomi/controls/cameraControls';
import { CustomEffect } from 'src/app/routes/su7/kokomi/postprocessing/customEffect';

@Component({
  selector: 'app-scene-beaut',
  templateUrl: './scene-beaut.component.html',
  styleUrls: ['./scene-beaut.component.less']
})
export class SceneBeautComponent implements OnInit , OnDestroy {

  constructor() { }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    new Demo('#three')
  }

}

class Demo extends Base {

  am: AssetManager;

  constructor(ele: string) {
    super(ele)


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
        { name: 'shaderBgc', type: LoaderType.Texture, path: "assets/images/bei.jpg", },
      ]
    })
    this.am = am

    this.useCameraControls()

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
          item.material.toneMapped = false; // tonemapping给关闭，因为tonemapping会自动把颜色的RGB值限制在0-1内，达不到自发光的要求
          item.material.emissiveIntensity = 50; //用到了自发光贴图emissive map，而这个贴图的显示效果跟材质的emissiveIntensity参数息息相关，将它调高就会使自发光的效果更加显著

          // envmap
          item.material.envMapIntensity = 0.5;  // 设置环境贴图的强度为 0.5
        }
      });


      const createPostprocessing = () => {
        const composer = new POSTPROCESSING.EffectComposer(this.renderer, {
          frameBufferType: THREE.HalfFloatType,
          multisampling: 8,
        });
        this.composer = composer;

        composer.addPass(
          new POSTPROCESSING.RenderPass(this.scene, this.camera)
        );

        // 用于实现泛光（Bloom）效果
        const bloom = new POSTPROCESSING.BloomEffect({
          blendFunction: POSTPROCESSING.BlendFunction.ADD,
          mipmapBlur: true,
          luminanceThreshold: 1, //luminanceThreshold设为了1，这是为了防止场景的其他部分发亮，仅仅让那些有emissive map的材质发亮
        });

        // 用于实现抗锯齿效果
        const smaa = new POSTPROCESSING.SMAAEffect();
        const effectPass = new POSTPROCESSING.EffectPass(
          this.camera,
          bloom,
          smaa
        );
        composer.addPass(effectPass);

        // 设置 renderer 的自动清除：
        this.renderer.autoClear = true;
      };

      createPostprocessing();


    })




  }


  useCameraControls() {
    const cameraControls = new CameraControls(this)
    cameraControls.controls.setTarget(0, 0, 0);
  }



}