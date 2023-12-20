import * as h337 from 'heatmap.js';
import * as THREE from 'three';
import { AdditiveBlending, CanvasTexture, Color, InstancedMesh, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, ShaderMaterial, Texture } from 'three';


export default class Heatmap {

    radius: number = 2

    heatMapDom: any;

    heatmap: any;

    greymap: any;

    declare heatMapPlane: any;

    data: any[] = [
        { x: 0, y: 0, value: 100 },
        { x: 115, y: 10, value: 100 },
        { x: 115, y: 0, value: 100 },
        { x: 0, y: 10, value: 100 },
    ]

    constructor(config: any) {
        this.heatMapDom = config.dom

        this.initHeatmap()

        this.initHeatMapMesh()
    }

    /** 热力图 */
    initHeatmap(): void {
        this.heatmap = window.h337.create({
            container: document.getElementById('heatmap')!,
            gradient: {
                0.5: '#1fc2e1',
                0.6: '#24d560',
                0.7: '#9cd522',
                0.8: '#f1e12a',
                0.9: '#ffbf3a',
                1.0: '#ff0000',
            },
            radius: this.radius,  //数据点的半径大小
            maxOpacity: 1,
        });
    }


    /** 灰度图 */
    initGreyMap(): void {
        this.greymap = window.h337.create({
            container: document.getElementById('heatmap')!,
            gradient: {
                0: 'black',
                '1.0': 'white',
            },
            radius: this.radius,
            maxOpacity: 1,
        })
    }


    build(crowdList: any): void {
        this.data = crowdList?.map((i: any) => this.createOneCrowd(i))
        this.setRandomData(this.data)
        this.setHeatMapTexture()
    }


    private createOneCrowd(params: number[]): any {
        return {
            x: params[0] + 0.4,
            y: (-params[1] + 0.4) + 10,
            value: params[2]
        }
    }

    update(): void {
        this.setRandomData(this.data);
        this.setHeatMapTexture()
    }

    // 设置纹理
    setHeatMapTexture(): void {
        let texture = new Texture(this.heatmap._config.container.children[0])   //创建纹理对象，用于存储热力图的 DOM 元素的纹理
        texture.needsUpdate = true
        this.heatMapPlane.material.uniforms.heatMap.value = texture
        this.heatMapPlane.material.side = THREE.DoubleSide // 双面渲染
    }


    initHeatMapMesh(): void {
        let geometry = new PlaneGeometry(115, 10, 300, 300)
        let material = new ShaderMaterial({
            transparent: true,
            vertexShader: `
            varying vec2 vUv;
            uniform float Zscale;
            uniform sampler2D greyMap;
            void main() {
                float aspectRatio = 115.0 / 115.0;       // 计算水平方向的缩放因子，保持宽高比例
                vUv = uv * vec2(aspectRatio, 1.0);  // 第一个参数是水平方向缩放因子 , 第二个参数是垂直方向缩放因子
                vec4 frgColor = texture2D(greyMap, vUv);
                float height = Zscale * frgColor.a;
                vec3 transformed = vec3( position.x , position.y, height);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            }
            `,
            fragmentShader: `#ifdef GL_ES
            precision highp float;
            #endif
            varying vec2 vUv;
            uniform sampler2D heatMap;
            uniform vec3 u_color;//基础颜色
            uniform float u_opacity; // 透明度
            void main() {
                gl_FragColor = vec4(u_color, u_opacity) * texture2D(heatMap, vUv);
            }`,
            uniforms: {
                heatMap: {
                    value: { value: undefined },
                },
                greyMap: {
                    value: { value: undefined },
                },
                Zscale: { value: 4.0 },
                u_color: {
                    value: new Color('rgb(255, 255, 255)'),
                },
                u_opacity: {
                    value: 1.0,
                },
            },
        })

        this.heatMapPlane = new Mesh(geometry, material)
        this.heatMapPlane.rotation.x = -Math.PI / 2; // 使平面水平
        this.heatMapPlane.position.set(57.5, 0.5, -5)
    }


    setRandomData(points: any[]) {
        const max = 1
        const min = 0
        this.heatmap.setData({
            max,
            min,
            data: points
        })
    }


}