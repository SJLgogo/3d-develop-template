import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import { Animator } from "../components/animator";
import { Clock } from "../components/Clock";
import type { EffectComposer } from "three-stdlib";

class Base{

    camera:THREE.PerspectiveCamera | THREE.OrthographicCamera;

    scene:THREE.Scene;

    renderer:THREE.WebGLRenderer;
    
    container:HTMLElement;

    composer: EffectComposer | any | null;

    animator:Animator;

    interactionManager: InteractionManager;

    clock:Clock;




    constructor(sel = "#sketch"){
        const camrea = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            0.01,
            10000
        )
        camrea.position.z = 1;
        this.camera = camrea

        const scene = new THREE.Scene()
        this.scene = scene

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setPixelRatio(Math.min(2 , window.devicePixelRatio));
        this.renderer = renderer

        const container = document.querySelector(sel) as HTMLElement;
        container?.appendChild(renderer.domElement);
        this.container = container;

        const animator = new Animator(this);
        this.animator = animator;

        const interactionManager = new InteractionManager(
            this.renderer,
            this.camera,
            this.renderer.domElement
        )
        this.interactionManager = interactionManager

        this.composer = null;

        const clock = new Clock(this);
        this.clock = clock;
    

        // this.AxesHelper(200)

        this.init();
    }

        // 增加原点坐标
    private AxesHelper(number: number): void {
            const axesHelper = new THREE.AxesHelper(number);
            this.scene.add(axesHelper);
    }

    update(fn:any){
        this.animator.add(fn)
    }

    init(){
        this.update(() => {
            this.interactionManager.update();
        });

        this.animator.update();
    }

    render(){
        if(this.composer){
            this.composer.render()
        }else{
            this.renderer.render(this.scene,this.camera)
        }
    }


    destory(){
        this.scene.traverse((child:any)=>{
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                Object.values(child.material).forEach((val:any)=>{
                    if(val && typeof val.dispose==='function'){
                        val.dispose()
                    }
                })
            }
        })

        this.renderer.dispose();
    }


}


export {Base}