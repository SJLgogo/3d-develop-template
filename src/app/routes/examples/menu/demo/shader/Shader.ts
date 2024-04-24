import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { AssetManager } from "src/app/routes/su7/kokomi/components/assetManager";
import { Component } from "src/app/routes/su7/kokomi/components/component";
import { OrbitControls } from "src/app/routes/su7/kokomi/controls/orbitControls";
import { Box } from "src/app/routes/su7/kokomi/shapes/Box";
import * as THREE from "three";
import fragShader from "./frag.glsl";

export class Shader extends Base{

    declare box :Box;

    constructor(eleName:string){
        super(eleName)

        this.scene.background = new THREE.Color('black')

        const camera = this.camera as THREE.PerspectiveCamera;
        camera.updateProjectionMatrix();
        const cameraPos = new THREE.Vector3(
            10,10,10
        );
        camera.position.copy(cameraPos);

        new OrbitControls(this)

        // const box = new Box(this)
        // this.box=box
        // box.addExisting()
        // this.setShader()

        this.initCircle()
    }


    initCircle(){
        const geometry = new THREE.SphereGeometry(2,64,64)
        // const material = new THREE.MeshBasicMaterial({color:'red'})

        const material = new THREE.ShaderMaterial({
            vertexShader:`
                void main(){
                    vec4 modelPosition=modelMatrix*vec4(position,1.);
                    vec4 viewPosition=viewMatrix*modelPosition;
                    vec4 projectedPosition=projectionMatrix*viewPosition;
                    gl_Position=projectedPosition;
                }
            `,
            fragmentShader:fragShader
        })


        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

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
            },
        })
        this.box.mesh.material = material

    }


    


}

