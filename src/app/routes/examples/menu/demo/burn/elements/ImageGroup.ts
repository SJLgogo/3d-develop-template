import * as THREE from "three";
import { ImageMesh } from "./Image";

const DURATION = 3;

export class ImageGroup extends THREE.Group{

    timeTransition:number = 0

    declare image:ImageMesh

    constructor(){ 
        super()
        this.name = 'ImageGroup';
    }

    start(noiseTex:THREE.Texture , imgTexes:THREE.Texture[]){
        const image = new ImageMesh();
        image.start(noiseTex,imgTexes)
        this.image = image

        this.add(image);
    }


    update(time:number){
        this.timeTransition += time;

        // 翻页
        if(this.timeTransition / DURATION >=1){
            this.timeTransition = 0;
            this.image.changeTex();
        }
    }
}