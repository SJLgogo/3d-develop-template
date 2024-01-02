import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Camera from "./Camera";

interface ControlsConfig {
    canvas: any,
    camera: Camera,
    controlsStart: (e: any) => void,
    controlsEnd: (e: any) => void,
}

export default class Controls {

    declare main: OrbitControls;

    constructor(config: ControlsConfig) {
        this.main = new OrbitControls(config.camera.main, config.canvas)
        this.main.enableRotate = true;
        this.main.enablePan = true;
        this.main.enableZoom = true;
        this.main.target.set(0, 0, 0);
        this.main.addEventListener('start', (e: any) => config.controlsStart.call(e, this));
        this.main.addEventListener('end', (e: any) => config.controlsEnd.call(e, this));
    }

}