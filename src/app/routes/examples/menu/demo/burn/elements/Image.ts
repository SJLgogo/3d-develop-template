import * as THREE from "three"
import vertexShader from '../glsl/imageVer.glsl'
import fragmentShader from '../glsl/imageFrag.glsl'

export class ImageMesh extends THREE.Mesh {

    imgIndexPrev = 0;
    imgIndexNext = 1;
    imgTexes:THREE.Texture[]=[]
    material:THREE.ShaderMaterial;

    constructor() {
        const geometry = new THREE.PlaneGeometry(30, 30, 64, 64);
        // const material = new THREE.MeshBasicMaterial({ color: 'red' })

        const material = new THREE.ShaderMaterial({
            uniforms:{
                noiseTex:{value:null} ,  // 噪音纹理
                imgPrevTex:{value:null}, // 当前图片纹理
                imgNextTex:{value:null}, // 下一张图片纹理
            },
            vertexShader:vertexShader,
            fragmentShader:fragmentShader
        })

        super(geometry, material)

        this.material = material
        this.name = 'Image';

    }

    start(noiseTex:THREE.Texture , imgTexes:THREE.Texture[]){
        this.imgTexes = imgTexes;

        this.material.uniforms.noiseTex.value = noiseTex
        this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
        this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
    }


    changeTex(){
    }

}