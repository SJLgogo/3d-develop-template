import { AxesHelper, Box3, Clock, Raycaster, Scene, Vector2, Vector3, WebGLRenderer, sRGBEncoding } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Camera from "./Camera";
import * as THREE from "three";
import Physics from "./Physics";
import CannonDebugger from 'cannon-es-debugger'
import User from "./User";
import { Body, BodyType, ShapeType } from "cannon-es";
import Light from "./Light";
import { gsap } from 'gsap'
import CustomCube from "./CustomCube";
import Composer from "./Composer";
import ThreeStats from "./Stats";
import Text from "./Text";
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Controls from "./Controls";
import Metro from "./Metro";
import BatchCrowd from "./BatchCrowd";
import Heatmap from "./Heatmap";
import { MqttUserParams, Users } from './Users'
import FlowLight from "./FlowLight";
import Station from "./Station";
import Car from "./Car";

interface Config {
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    element: any
}



export default class World {

    isReady: boolean = false; // 是否初始化完

    declare canvas: HTMLCanvasElement

    declare width: number
    declare height: number

    declare raycaster: Raycaster;

    declare mouse: Vector2;

    clickTimer: any;

    // 时钟
    declare clock: Clock;

    // 控制器
    declare controls: Controls;

    // 渲染器
    declare renderer: WebGLRenderer;

    declare css3DRenderer: CSS3DRenderer;

    // 场景
    declare scene: Scene;

    // 相机
    declare camera: Camera;

    // 灯光
    declare light: Light;

    // 物理世界
    declare physics: Physics;

    declare composer: Composer;

    declare cannonDebugger: any;

    declare customCube: CustomCube;

    declare batchCrowd: BatchCrowd;

    declare config: Config;

    declare threeStats: ThreeStats

    declare text: Text;

    declare upMetro: Metro;

    declare downMetro: Metro;

    declare resources: any;

    declare heatmap: Heatmap;

    declare users: Users;

    declare flowLight: FlowLight

    declare station: Station

    declare car : Car;

    controlsStart = (e: any) => {

    }

    controlsEnd = (e: any) => {
    }


    constructor(config: Config) {
        this.width = config.width
        this.height = config.height
        this.canvas = config.canvas
        this.config = config

        this.clock = new Clock()

        this.scene = new Scene()
        this.scene.background = new THREE.Color('rgb(98,98,100)');


        this.camera = new Camera(this.width, this.height)
        this.renderer = this.createRenderer(config)
        this.css3DRenderer = this.createCssRender()

        this.controls = new Controls({
            camera: this.camera,
            canvas: this.canvas,
            controlsStart: this.controlsStart,
            controlsEnd: this.controlsEnd,
        })


        this.physics = new Physics()
        this.cannonDebugger = CannonDebugger(this.scene, this.physics.world)

        this.light = new Light(this.scene)

        this.customCube = new CustomCube(this.physics)

        this.station = new Station(this.physics)

        this.composer = new Composer(this.renderer, this.scene, this.camera)

        this.threeStats = new ThreeStats()

        this.text = new Text()

        this.batchCrowd = new BatchCrowd()

        this.upMetro = new Metro(new Vector3(120, 0, 0))

        this.downMetro = new Metro(new Vector3(-70, 0, 13))

        this.heatmap = new Heatmap({ dom: config.element })

        this.users = new Users(this.physics, this.clock)

        this.car = new Car(this.physics)

        this.flowLight = new FlowLight()

        this.init()
    }


    private init() {
        this.AxesHelper(200)
        this.initClick()
    }


    // 创建渲染器
    private createRenderer(config: Config) {
        const renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: false,    //开启优化锯齿
            alpha: true
        })
        renderer.setSize(this.width, this.height)
        renderer.setAnimationLoop(this.render.bind(this))
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputEncoding = sRGBEncoding
        config.element.appendChild(renderer.domElement);
        return renderer
    }


    // 创建3D渲染器
    private createCssRender(): CSS3DRenderer {
        const css3DRenderer = new CSS3DRenderer();
        css3DRenderer.setSize(this.config.element.offsetWidth, this.config.element.offsetHeight);
        css3DRenderer.domElement.style.position = 'absolute';
        css3DRenderer.domElement.style.top = '0px';
        css3DRenderer.domElement.style.left = '0px';
        css3DRenderer.domElement.style.pointerEvents = 'none'; //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
        this.config.element.appendChild(css3DRenderer.domElement);
        return css3DRenderer
    }


    // 渲染
    private render() {
        this.physics.world.step(1 / 60);//更新物理计算
        this.physics.world.fixedStep()
        this.cannonDebugger.update()
        const deltaTime: number = this.clock.getDelta();

        if (this.isReady) {

            this.camera.isReady && this.camera.initUpdate()

            this.text.update(this.camera)

            this.car.update()

            this.threeStats.begin()
            this.threeStats.end()

            this.upMetro.tween && this.upMetro.update()

            this.users.isReady && this.users.update()

            this.customCube.update()
        }

        this.composer.selectedObjects.length ? this.composer.update() : this.renderer.render(this.scene, this.camera.main)

        this.css3DRenderer.render(this.scene, this.camera.main);
    }


    // 增加原点坐标
    private AxesHelper(number: number): void {
        const axesHelper = new AxesHelper(number);
        this.scene.add(axesHelper);
    }


    build(resources: any): void {

        this.resources = resources

        // 3d文本
        // this.text.build(`
        //     <h1>3D</h1>
        // `)
        // this.scene.add(this.text.cSS3DObject)

        // 自定义Cube
        this.customCube.build()
        this.scene.add(this.customCube.model)

        // 区域拥挤
        // this.crowd.build(resources)
        // this.scene.add(this.crowd.model)

        // 模型背景
        // this.scene.background = resources['scene_background'];
        // this.scene.environment = resources['scene_background'];


        // 流光
        // this.flowLight.build()
        // this.scene.add(this.flowLight.main)


        // 上行地铁
        // this.upMetro.build(resources['metro'].scene)
        // this.upMetro.createTween(new Vector3(0, 0, 0))
        // this.scene.add(this.upMetro.model)


        // 下行地铁
        // this.downMetro.build(resources['metro'].scene)
        // this.downMetro.createTween(new Vector3(0, 0, 13))
        // this.scene.add(this.downMetro.model)

        // 站台
        // this.station.build(resources['station'].scene)
        // this.scene.add(this.station.main)

        // 人员数据
        // this.users.build({
        //     resources: this.resources
        // })
        this.scene.add(this.users.main)
        // 车辆
        this.car.build(resources['model-car'].scene)
        this.car.setControls()
        this.scene.add(this.car.main)

        // setTimeout(() => {
        //     // this.receiveUserMqtt({ userId: '1', coordinate: [25, 0.2, -5], userColorStatus: 1 })
        //     this.receiveUserMqtt({ userId: '3', coordinate: [25, 0, -5] })
        //     setTimeout(() => {
        //         this.receiveUserMqtt({ userId: '3', lineCoordinate: [[25, 0, -5], [75, 0, -5]]})
        //     }, 2000);
        // })
        

        this.isReady = true

        this.camera.ready(() => {
            this.camera.isReady = false
        })
    }


    initClick(): void {
        this.raycaster = new Raycaster();

        this.mouse = new Vector2();

        this.config.element.addEventListener('click', this.windowClick, false);
    }

    removeClick(): void {
        this.config.element.removeEventListener('click', this.windowClick, false);
    }


    private windowClick = (e: any) => {
        if (!document) return
        clearTimeout(this.clickTimer);

        this.clickTimer = setTimeout(() => {

            const sceneRect = this.config.element.getBoundingClientRect();
            const sceneWidth = sceneRect.width;
            const sceneHeight = sceneRect.height;

            this.mouse.x = ((e.clientX - sceneRect.left) / sceneWidth) * 2 - 1;
            this.mouse.y = -((e.clientY - sceneRect.top) / sceneHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera.main);
            const intersects: any = raycaster.intersectObjects(this.scene.children, true); // 计算射线和场景中的对象相交情况
            const clickDomMark = ['mascot', 'camera', 'Region']
            let clickedObject;

            // 如果有物体相交，则触发点击事件
            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                clickedObject = intersects[0].object;
                console.log('点击位置的三维坐标:', intersectionPoint);
                console.log(clickedObject.name, clickedObject);
                clickedObject?.dispatchEvent({ type: 'click' });
            }
        }, 250)
    }



    batchCreationCrowd(crowdList: number[][]): void {
        let sum = 0
        crowdList.forEach((i: any) => sum += i[2])

        // this.heatmap.build(crowdList)
        // this.scene.add(this.heatmap.heatMapPlane)

        // this.batchCrowd.build(crowdList, this.resources)
        // this.scene.add(this.batchCrowd.main)
    }


    receiveUserMqtt(params: MqttUserParams): void {
        const user = this.users.getUser(params.userId)
        user ? user.eventQueue.enqueue(params) : this.users.addUser(params)
    }


    destory(): void {
        this.scene.children.forEach((child) => {
            this.scene.remove(child);
        });
        this.renderer.setAnimationLoop(null);
        this.renderer.dispose();
        this.removeClick();
        this.resources = null;
        this.threeStats.remove()
    }


}