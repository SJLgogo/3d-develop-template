import { Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3, Color, Box3 } from 'three'

// import vertexShader from '@/shaders/custom-shadow/vertex.glsl'
// import fragmentShader from '@/shaders/custom-shadow/fragment.glsl'

export enum CustomShadowType {
    box = 'box',
    circle = 'circle'
}

export default class CustomShadow {
    source: Object3D

    main: Mesh
    declare material: ShaderMaterial

    declare rotation: number;

    type: CustomShadowType
    constructor(type: CustomShadowType = CustomShadowType.box) {
        this.type = type

        this.source = new Object3D()
        this.material = new ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main () {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
            uniform vec3 uColor;
            uniform float uType;
            uniform float uOpacity;

            varying vec2 vUv;

            #define PI 3.141592653589793
            #define RADIUS .5

            float sineInOut (float t) {
                return - 0.5 * (cos(PI * t) - 1.0);
            }

            void main () {
                vec2 uv = vUv * 2. - 1.;    

                float strength;

                if (uType == 0.) {
                    float lengthX = abs(uv.x);
                    float lengthY = abs(uv.y);
                    // box
                    if (lengthX > 1. - RADIUS && lengthY > 1. - RADIUS) {
                        strength = clamp(1.0 - distance(vec2(lengthX, lengthY), vec2(1.0 - RADIUS, 1.0 - RADIUS)) / RADIUS, 0.0, 1.0);
                    } else {
                        float strengthX = clamp((1.0 - lengthX) / RADIUS, .0, 1.);
                        float strengthY = clamp((1.0 - lengthY) / RADIUS, .0, 1.);
                        strength = strengthX * strengthY;
                    }

                } else {
                    // circle
                    strength = clamp(1.0 - length(uv), 0., 1.);
                }

                float opacity = sineInOut(strength);

                opacity *= uOpacity * .5;
                
                gl_FragColor = vec4(uColor, opacity);   
                }
            `,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uType: {
                    value: this.type === CustomShadowType.box ? 0. : 1.
                },

                uColor: {
                    value: new Color('#692c02')
                },
                uOpacity: {
                    value: 0.
                }
            }
        })

        // 阴影大小
        const geometry = new PlaneGeometry(1.0, 1.0, 2, 2)
        this.main = new Mesh(geometry, this.material)
        this.main.rotation.x = -Math.PI / 2; 
    }

    build(source: Object3D) {
        this.source = source

        const box = new Box3().setFromObject(this.source)
        const scaleX = box.max.x - box.min.x
        const scaleY = box.max.y - box.min.y

        this.main.scale.set(scaleX, scaleY, 1)

        this.update()
    }

    update() {
        // set position
        const position = this.source.position.clone()
        position.x += .1
        position.z += .1
        this.main.position.copy(position)
        this.main.position.y = 0

        // set rotationd
        const rotationVector = new Vector3(1, 0, 0)
        rotationVector.applyQuaternion(this.source.quaternion)
        rotationVector.projectOnPlane(new Vector3(0, 0, 1))
        const angle = Math.atan2(rotationVector.y, rotationVector.x)
        this.main.rotation.z = angle


        // set opacity
        let height = this.source.position.y
        height = height > 1 ? 1 : height
        const opacity = 1.0 - height
        this.material.uniforms.uOpacity.value = opacity
    }
}