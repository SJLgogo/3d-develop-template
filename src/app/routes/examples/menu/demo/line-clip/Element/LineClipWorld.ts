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

    t1:any;

    windLineBloom:any;

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
        this.localPlane.constant = -260
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
        folderLocal.add(propsLocal, 'Plane').min(-1000).max(1000).step(0.1).onChange((v) => {
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
        }
      })
        this.container.add(gltf.scene)
    }


    changeWind() {
      this.t1 = gsap.timeline()
      this.t1.to(this.base.scene.rotation, {
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          this.base.scene.updateMatrixWorld(true)
          this.localPlane.normal.set(0, 0, - 1);
          this.base.clipedge.clippingPlanes[0].normal.set(0, 0, - 1)
          this.localPlane.applyMatrix4(this.base.clipedge.planeMesh.matrixWorld);
        }
      })
        // .to(this.topLight.material, {
        //   emissiveIntensity: 0,
        //   duration: 1,
        //   ease: 'power2.out',
        // }, "<")
        // .to(this.base.scene.fog, {
        //   density: 0.06,
        //   duration: 1,
        //   ease: 'power2.out',
        // }, "<")
        // .to(this.base.camera.position, {
        //   z: 24,
        //   duration: 1,
        //   ease: 'power2.out',
        // })
        .to(this.localPlane, {
          constant: 300,
          duration: 5,
          ease: 'power2.out',
          onUpdate: () => {
            this.base.clipedge.planeMesh.position.z = this.localPlane.constant
          },
          onStart: () => {
            // this.isWindMode = true
            // this.lineBloom.group.visible = true
            // this.bloomEffect.selection.set([ this.base.clipedge.outlineLines, ...this.lineBloom.allLinesMesh])
            this.bloomEffect.selection.set([ this.base.clipedge.outlineLines])
          }
        }, ">+2.5")
    
       
    }

}


