import * as THREE from "three";
import { Base } from "../../../kokomi/Base/base";
import { Component } from "../../../kokomi/components/component";
import Experience from "../Experience";
import { Car } from "./Car";
import gsap from "gsap";
import { DynamicEnv } from "./DynamicEnv";
import { getEnvmapFromHDRTexture } from "../../../kokomi/utils/misc";
import { StartRoom } from "./StartRoom";

export default class World extends Component {

    declare base:Experience;

    dynamicEnv!:DynamicEnv;

    car!:Car;

    t1!:any;
    
    startRoom!: StartRoom;


    constructor(base:Experience){
        super(base)     
        
        base.am.on('ready',()=>{

            
            const t1 = gsap.timeline()
            this.t1 = t1

            this.handleAssets()

            this.base.scene.background = new THREE.Color("black");

            // this.setSceneHdr()

            const envmap1 = getEnvmapFromHDRTexture(
                this.base.renderer,
                this.base.am.resources["ut_env_night"]
              );
            const envmap2 = getEnvmapFromHDRTexture(
                this.base.renderer,
                this.base.am.resources["ut_env_light"]
              );


            const dynamicEnv = new DynamicEnv(this.base,{
                envmap1,
                envmap2
            })
            this.dynamicEnv= dynamicEnv
            this.base.scene.environment = dynamicEnv.envmap;  
            dynamicEnv.setWeight(1);


            const startRoom = new StartRoom(this.base);
            this.startRoom = startRoom;
            startRoom.addExisting();



            const car = new Car(this.base)
            this.car= car
            // car.addExisting();

            this.enter()
        })
    }   

    setSceneHdr() {
        const texture = this.base.am.resources['ut_env_night']
        // console.log(texture);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.base.scene.background = texture;
        this.base.scene.environment = texture;
    }



    handleAssets(){
        const resources= this.base.am.resources

        resources['ut_car_body_ao'].flipY = false
        resources['ut_car_body_ao'].colorSpace =  THREE.LinearSRGBColorSpace;
        resources['ut_car_body_ao'].minFilter =  THREE.NearestFilter;
        resources['ut_car_body_ao'].magFilter = THREE.NearestFilter;
        resources['ut_car_body_ao'].channel = 1;

    }


    enter(){
        this.base.params.isCameraMoving = true
        this.t1.to(this.base.params.cameraPos,{
            x:0,
            y:0.8,
            z:-7,
            duration: 4,
            ease: "power2.inOut",
            onComplete:()=>{
                this.base.params.isCameraMoving = false
            }
        })

        




    }
    

}