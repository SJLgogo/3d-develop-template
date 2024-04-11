import { LoaderType } from "src/app/routes/standard/utiles/Loader";
import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager } from "src/app/routes/su7/kokomi/components/assetManager";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { OrbitControls } from "src/app/routes/su7/kokomi/controls/orbitControls";
import { Box } from "src/app/routes/su7/kokomi/shapes/Box";
import * as THREE from "three";

export class Shader extends Base{

    box :Box;

    constructor(eleName:string){
        super(eleName)

        this.scene.background = new THREE.Color('black')

        new OrbitControls(this)

        // new AssetManager(this , [
        //     {
        //         name: "hdr",
        //         type: LoaderType.HDR,
        //         path: "https://kokomi-demo-1259280366.cos.ap-nanjing.myqcloud.com/potsdamer_platz_1k.hdr",
        //       },
        // ])

        const box = new Box(this)
        this.box=box
        box.addExisting()

        this.setShader()

    }


    
    setShader(){
        const material = new THREE.ShaderMaterial({
            vertexShader:`
            uniform float iTime;
                uniform vec3 iResolution;
                uniform vec4 iMouse;

                varying vec2 vUv;

                void main(){
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    vUv = uv;
                }
            `,
            fragmentShader: 
            `
            uniform float iTime;
            uniform vec3 iResolution;
            uniform vec4 iMouse;

            varying vec2 vUv;

            uniform sampler2D uEnvmap1;
            uniform sampler2D uEnvmap2;
            uniform float uWeight;
            uniform float uIntensity;

            void main(){
                vec2 uv=vUv;
                uv = (uv-.5)*2.;
                gl_FragColor=vec4(uv,0.,1.);
            }
            `,
            uniforms:{
                // uEnvmap1:{
                //     value:envmap1
                // },
                // uEnvmap2: {
                //     value:envmap2,
                // },
                // uWeight: {
                //     value: 0,
                // },
                // uIntensity: {
                //     value: 1,
                // },
            },
        })
        this.box.mesh.material = material

    }


    


}

