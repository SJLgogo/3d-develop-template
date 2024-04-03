import * as THREE from "three";
import { Base } from "../../../kokomi/Base/base";
import { Component } from "../../../kokomi/components/component";
import Experience from "../Experience";
import { Car } from "./Car";

export default class World extends Component {

    declare base:Experience;

    car!:Car;


    constructor(base:Experience){
        super(base)     
        
        base.am.on('ready',()=>{
            console.log('加载完成');

            // this.base.scene.background = new THREE.Color("black");

            const car = new Car(this.base)
            this.car= car
            car.addExisting();
        })
    }   

    

}