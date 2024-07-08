import { Component } from "src/app/routes/su7/kokomi/components/component";
import { LineClip } from "./LineClip";
import * as THREE from "three";
import { BlendFunction, EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";
import { GUI } from "dat.gui";
import { gsap } from 'gsap'

export class LineClipWorld extends Component{

    declare localPlane:THREE.Plane

    declare bloomEffect:any;  // 辉光

    declare gui:GUI;

    topLight:any;

    t2:any;

    constructor(base:LineClip){
        super(base)
    }

    init(){
        this.initClipPlane();
        this.initComposer();
        this.initGui();
    }

    initClipPlane() {
        this.localPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
        this.localPlane.constant = 13
    }
    

    initComposer(){
        const effect = new SelectiveBloomEffect(this.base.scene, this.base.camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: 0.8,
            opacity: 0.6,
            intensity: 3.0
          });
          effect.inverted = true;  // 辉光效果将应用于未选中的对象
          effect.ignoreBackground = true  // 辉光效果将忽略背景
          effect.selection.set([])  //清空选择集 所有对象都会应用辉光效果
          this.bloomEffect = effect


          let material = new THREE.MeshBasicMaterial({ color: 0x3fffff });
          let geometry = new THREE.PlaneGeometry(5, 5, 10, 10);
          let plane = new THREE.Mesh(geometry, material);
          let plane2 = new THREE.Mesh(geometry, material);
          plane2.position.x = 6
          plane2.position.y = 6
          plane.position.y = 6
          plane.scale.set(0.01, 0.01, 0.01)
          plane2.scale.set(0.01, 0.01, 0.01)
          // this.container.add(plane, plane2)


          let composerBloom = new EffectComposer(this.base.renderer);
          composerBloom.addPass(new RenderPass(this.base.scene, this.base.camera))
          const effectPass = new EffectPass(this.base.camera, effect);
          composerBloom.addPass(effectPass);
          this.base.composer = composerBloom
    }


    initGui() {
        this.gui = new GUI({ width: 260 });
        let folderLocal = this.gui.addFolder('Local Clipping')
        let propsLocal = {
          Enabled: true,
          Plane: 0
        }
        folderLocal.add(propsLocal, 'Plane').min(-10000).max(10000).step(1).onChange((v) => {
          this.localPlane.constant = v;
          (this.base as LineClip).clipedge.planeMesh.position.z = v / (this.base as LineClip).clipedge.scaleValue + 0.05
        });
    }

    addExisting(){
      const gltf = (this.base as LineClip).am.resources['car']
      // gltf.scene.scale.set(2, 2, 2)
      gltf.scene.position.y = 0.2
      gltf.scene.name = 'carScene'

      gltf.scene.traverse((item:any) => {
        if (item.isMesh) {
          item.material.clippingPlanes = [this.localPlane]
          item.stencilRef = 1
          item.stencilWrite = true
          item.stencilWriteMask = 0xff
          item.stencilZPass = THREE.ReplaceStencilOp
          item.geometry.computeVertexNormals()
          if (item.name === '平面') {
            item.visible = false
          }
          if (item.name === 'topLigt') {
            item.material.clippingPlanes = []
            item.position.y = 6
            item.scale.set(12, 0.04, 6)
            // item.visible = false
            item.material.emissiveIntensity = 0.52
            // item.material.emissiveIntensity = 0
            this.topLight = item
          }
        }
      })
        this.container.add(gltf.scene)
    }

    changeNormal() {
      const clipedge = (this.base as LineClip).clipedge
      this.topLight.material.emissiveIntensity = 0
      this.localPlane.normal.set(0, 0, - 1);
      this.localPlane.applyMatrix4(clipedge.planeMesh.matrixWorld);
      this.t2 = gsap.timeline();
      this.t2.to(this.localPlane, {
        constant: 13,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          clipedge.planeMesh.position.x = this.localPlane.constant
        },
        onComplete: () => {
          // this.lineBloom.group.visible = false
        },
      })
        .to(this.base.camera.position, {
          z: 22,
          duration: 1,
          ease: 'power2.out',
        }, ">")
        .to(this.base.scene.fog, {
          density: 0.01,
          ease: 'power2.out'
        }, "<")
        .to(this.topLight.material, {
          emissiveIntensity: 0.52,
          ease: 'power2.out',
        }, "<")
        .to(this.base.scene.rotation, {
          y: `-=${Math.PI * 1.3}`,
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
            // this.lineBloom.group.visible = false
            this.localPlane.normal.set(0, 0, - 1);
            this.localPlane.applyMatrix4((this.base as LineClip).clipedge.planeMesh.matrixWorld);
            this.base.scene.updateMatrixWorld(true)
          }
        }, ">+1")
    }

    // addLineBloom(Curves:any) {
    //   let lineBloom = new LineBloom(Curves)
    //   lineBloom.group.visible = false
    //   this.lineBloom = lineBloom
    //   this.scene.add(lineBloom.group)
    //   return lineBloom
    // }

}


