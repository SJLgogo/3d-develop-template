
import * as THREE from "three";

export class Util{
    static getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    static getRadian = (degrees: any) => {
        return degrees * Math.PI / 180;
    }
    
    static getPolarCoord = (rad1:any, rad2:any, r:any)=>{
        var x = Math.cos(rad1) * Math.cos(rad2) * r;
        var z = Math.cos(rad1) * Math.sin(rad2) * r;
        var y = Math.sin(rad1) * r;
        return new THREE.Vector3(x, y, z);
    }
}