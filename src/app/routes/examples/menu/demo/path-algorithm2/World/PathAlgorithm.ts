import { Base } from "src/app/routes/su7/kokomi/Base/base";
import { CameraControls } from "src/app/routes/su7/kokomi/controls/cameraControls";
import * as THREE from "three";
import { Grid } from "./Grid";
import { RaycastSelector } from "src/app/routes/su7/kokomi/components/raycastSelector";
import { RollOverMesh } from "./RollOverMesh";
import { Cube } from "./Cube";
import { aStar } from "../A-algorithm/aStar";
import { PassGate } from "../A-algorithm/passGate";
import { PersonSimluation } from "../A-algorithm/personSimulation";

export class PathAlgorithm2 extends Base {

    grid: Grid;

    // cube:Cube;

    cubeList: Cube[] = [];

    rollOverMesh: RollOverMesh;

    declare raycastSelector: RaycastSelector;

    pointer = new THREE.Vector2();

    raycaster = new THREE.Raycaster();

    objects: any = [];

    personSimlutaion:PersonSimluation;

    constructor(eleName: string) {
        super(eleName)

        const camera: any = this.camera;
        camera.position.copy(new THREE.Vector3(0, 2000, 0));
        camera.fov = 35;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        this.useCameraControls();

        this._initSceneClick();

        this.AxesHelper2(100);

        const grid = new Grid(this);
        grid.addExisting();
        this.grid = grid;

        const rollOverMesh = new RollOverMesh(this);
        rollOverMesh.addExisting();
        this.rollOverMesh = rollOverMesh;


        const personSimlutaion = new PersonSimluation();
        this.personSimlutaion = personSimlutaion;
        personSimlutaion.simulate();

      

        for (let i = 0; i <= 10; i++) {
            const cube = new Cube(this);
            cube.model.position.set(-475, 25, 475);
            cube.addExisting();
            const path = aStar([-475, 475], [-25, 25], 25)
            cube.move(path);
            this.cubeList.push(cube);
        }


        
        


    }


    useCameraControls() {
        const cameraControls = new CameraControls(this)
        cameraControls.controls.setTarget(0, 0, 0);
    }


    // 增加原点坐标
    AxesHelper2(number: number): void {
        const axesHelper = new THREE.AxesHelper(number);
        this.scene.add(axesHelper);
    }



    _initSceneClick() {
        this.raycastSelector = new RaycastSelector(this)

        this.renderer.domElement.addEventListener('click', (e) => {

            this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);

            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.grid.objects, false);


            if (intersects.length > 0) {

                const intersect: any = intersects[0];
                const pointPos = new THREE.Vector3()
                pointPos.copy(intersect.point).add(intersect.face.normal);
                pointPos.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

                for (let i = 0; i < this.cubeList.length; i++) {
                    const { x, z } = this.cubeList[i].model.position;
                    const path = aStar([x, z], [pointPos.x, pointPos.z], 25)
                    this.cubeList[i].move(path);
                }

            }

        })

        this.renderer.domElement.addEventListener('pointermove', (e) => {

            this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);

            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.grid.objects, false);

            if (intersects.length > 0) {

                const intersect: any = intersects[0];
                this.rollOverMesh.model.position.copy(intersect.point).add(intersect.face.normal);
                this.rollOverMesh.model.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

            }
        })
    }

}