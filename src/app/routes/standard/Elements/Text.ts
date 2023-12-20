import { Vector3 } from 'three';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Camera from './Camera';


export default class Text {


    declare cSS3DObject: CSS3DObject;

    scalex: number = 0.2

    scaley: number = 0.2

    scalez: number = 0.2

    target: Vector3 = new Vector3(0, 0, 0)

    needFloowCamera: boolean = true

    constructor() {

    }

    build(innerHTML: string): CSS3DObject {
        const div = document.createElement('div')
        div.className = "tips";
        div.innerHTML = innerHTML
        console.log(div);
        const cSS3DObject = new CSS3DObject(div);
        cSS3DObject.visible = true;
        div.style.pointerEvents = 'none';
        cSS3DObject.scale.set(this.scalex, this.scaley, this.scalez);
        cSS3DObject.position.copy(this.target)
        this.cSS3DObject = cSS3DObject
        return this.cSS3DObject
    }

    update(camera: Camera): void {
        this.cSS3DObject?.lookAt(camera.main.position)
    }


}