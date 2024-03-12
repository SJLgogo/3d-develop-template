import * as THREE from "three";
import { BODY_TYPES, Body, BodyType, Box, ContactMaterial, Cylinder, Material, Plane, Quaternion, SAPBroadphase, SHAPE_TYPES, Vec3, World } from "cannon-es";
import { AxesHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from "./Sky";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CannonDebugger from "cannon-es-debugger";
import { ShapeType, threeToCannon } from 'three-to-cannon';
import { TrimeshCollider } from "./TrimeshCollider";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { BoxCollider } from "./BoxCollider";
import { CollisionGroups } from "./CollisionGroups";


export class SktechWorld {

  public declare renderer: THREE.WebGLRenderer;

  public declare camera: THREE.PerspectiveCamera;

  public declare scene: THREE.Scene;

  public declare physicsWorld: any;
  public sky: Sky;
  public updatables: any[] = [];
  public timeScaleTarget: number = 1;
  controller: any;
  declare cannonDebugger: any;

  constructor() {
    this.initRender()
    this.initCamera()
    this.generateHTML()
    this.initPhysicsWord()
    this.AxesHelper(1000)
    this.sky = new Sky(this);
    this.initContorller()
    this.loadGltf()
    this.render(this);
  }

  initContorller() {
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.enableRotate = true;
    this.controller.enablePan = true;
    this.controller.enableZoom = true;
  }

  initRender() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initCamera() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010);
    this.camera.position.set(1, 1, 1);
    this.camera.lookAt(0, 0, 0);
  }

  initPhysicsWord() {
    this.physicsWorld = new World();
    this.physicsWorld.gravity.set(0, -9.81, 0);
    this.physicsWorld.broadphase = new SAPBroadphase(this.physicsWorld);
    this.physicsWorld.solver.iterations = 10;
    this.physicsWorld.allowSleep = true;
    this.cannonDebugger = CannonDebugger(this.scene, this.physicsWorld)
  }

  render(world: SktechWorld) {

    requestAnimationFrame(() => world.render(world));
    this.physicsWorld.step(1 / 60);//更新物理计算
    this.physicsWorld.fixedStep()
    this.cannonDebugger.update()
    this.renderer.render(this.scene, this.camera);
  
  }


  generateHTML() {
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = 'canvas';
  }


  private AxesHelper(number: number): void {
    const axesHelper = new AxesHelper(number);
    this.scene.add(axesHelper);
  }


  public scrollTheTimeScale(scrollAmount: number): void {
    const timeScaleBottomLimit = 0.003;
    const timeScaleChangeSpeed = 1.3;

    if (scrollAmount > 0) {
      this.timeScaleTarget /= timeScaleChangeSpeed;
      if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = 0;
    }
    else {
      this.timeScaleTarget *= timeScaleChangeSpeed;
      if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = timeScaleBottomLimit;
      this.timeScaleTarget = Math.min(this.timeScaleTarget, 1);
    }
  }

  public registerUpdatable(registree: any): void {
    this.updatables.push(registree);
    this.updatables.sort((a: any, b: any) => (a.updateOrder > b.updateOrder) ? 1 : -1);
  }

  cannonVector(vec: THREE.Vector3): Vec3
    {
      return new Vec3(vec.x, vec.y, vec.z);
    }


    cannonQuat(quat: THREE.Quaternion): Quaternion
  {
    return new Quaternion(quat.x, quat.y, quat.z, quat.w);
  }


  loadGltf() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('assets/sketch/world.glb',
      (gltf) => {
        console.log(gltf);
        gltf.scene.traverse((child) => {
          if (child.hasOwnProperty('userData'))
          {
    
            if (child.userData.hasOwnProperty('data'))
            {
              if (child.userData.data === 'physics')
              {
                if (child.userData.hasOwnProperty('type')) 
                {
                  if (child.userData.type === 'box')
                  {
                    let phys = new BoxCollider({size: new THREE.Vector3(child.scale.x, child.scale.y, child.scale.z)});
                    phys.body.position.copy(this.cannonVector(child.position));
                    phys.body.quaternion.copy(this.cannonQuat(child.quaternion));
                    if( phys.body.hasOwnProperty('computeAABB')){
                      phys.body.computeAABB()
                    }
    
                    phys.body.shapes.forEach((shape:any) => {
                      shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
                    });
    
                    this.physicsWorld.addBody(phys.body);
                  }
                  else if (child.userData.type === 'trimesh')
                  {
                    let phys = new TrimeshCollider(child, {});
                    phys.body &&this.physicsWorld.addBody(phys.body);
                  }
    
                  child.visible = false;
                }
              }
            }
          }
        });
        this.scene.add(gltf.scene)
      },
      (xhr) => {

      },
      (error) => {
        console.error(error);
      });

  }



}