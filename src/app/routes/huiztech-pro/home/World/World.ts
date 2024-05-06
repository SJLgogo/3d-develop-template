import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { Huiztech } from "../Huiztech";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { Station } from "./Station";
import { gsap } from 'gsap'
import { getEnvmapFromHDRTexture } from "src/app/routes/su7/kokomi/utils/misc";

export class World extends Component{

    declare base:Huiztech;

    station!:Station;


    constructor(base:Huiztech){
        super(base)
        this.base.am.on('ready',()=>this.loadFinish())
    }

    loadFinish(){
        const station = new Station(this.base)
        station.addExisting()
        this.station = station

        const envMap = getEnvmapFromHDRTexture(
            this.base.renderer,
            this.base.am.resources["hdr"]
          );
        this.base.scene.environment = envMap;
        this.base.scene.background = envMap;


        this.enter()
    }

    enter(){
        this.loadingClose()
        this.base.params.isCameraMoving = true
        gsap.to(this.base.params.cameraPos,{
            x:1565.2177489581532,
            y:245.20557003397877,
            z:453.93137740914995,
            duration:2,
            ease: "power2.inOut",
            onComplete:()=>{
                this.base.params.isCameraMoving = false
            }
        })
    }


    loadingClose(){
        gsap.to('.loading', {
            opacity: 0, onComplete: () => {
            }
        })
    }

}