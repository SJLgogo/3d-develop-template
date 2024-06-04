import * as THREE from "three"
import vertexShader from '../glsl/imageVer.glsl'
import fragmentShader from '../glsl/imageFrag.glsl'
import { UniformInjector } from "src/app/routes/su7/kokomi/components/uniformInjector";

export class ImageMesh extends THREE.Mesh {

    imgIndexPrev = 0;
    imgIndexNext = 1;
    imgTexes: THREE.Texture[] = []
    material: THREE.ShaderMaterial;

    constructor() {
        const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                noiseTex: { value: null },  // 噪音纹理
                imgPrevTex: { value: null }, // 当前图片纹理
                imgNextTex: { value: null }, // 下一张图片纹理
                easeTransition: { value: 0 }, // 控制过渡效果的进度
                time: { value: 0 },
                imgRatio: { value: new THREE.Vector2() },  // 图片比例
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })


        super(geometry, material)

        this.material = material
        this.name = 'Image';

    }

    start(noiseTex: THREE.Texture, imgTexes: THREE.Texture[]) {
        this.imgTexes = imgTexes;

        this.material.uniforms.noiseTex.value = noiseTex
        this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
        this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
    }


    changeTex() {
        
        this.imgIndexPrev = this.imgIndexNext;
        this.imgIndexNext = (this.imgIndexNext + 1 >= this.imgTexes.length)
            ? 0
            : this.imgIndexNext + 1;
        console.log(this.imgTexes ,  this.imgIndexPrev , this.imgIndexNext);

        this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
        this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
    }


    update(time: number, easeStep: number) {
        this.material.uniforms.easeTransition.value = easeStep
        this.material.uniforms.time.value = time
    }

    resize(size: THREE.Vector3) {
        this.material.uniforms.imgRatio.value.set(
            Math.min(1, size.x / size.y),
            Math.min(1, size.y / size.x)
          );
        this.scale.copy(size);
    }

}