import { Component } from "src/app/routes/su7/kokomi/components/component";
import { LineClip } from "./LineClip";
import * as THREE from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHHelper, CONTAINED } from 'three-mesh-bvh';

export class OutLineClip extends Component {
    scaleValue = 1;

    params: any = {
        useBVH: true,
        helperDisplay: false,
        helperDepth: 10,

        wireframeDisplay: false,
        displayModel: false,

        animate: true,
        animation: 'OSCILLATE',
        invert: false,
    };

    declare group: THREE.Group;

    declare planeMesh: THREE.Mesh;

    base: LineClip;

    outlineLines: any;

    frontSideModel: any;

    backSideModel: any;

    bvhHelper: any; // mesh-bvh调试工具

    colliderBvh: any;

    colliderMesh: any;

    time = 0;

    initialClip = false;

    tempVector = new THREE.Vector3();
    tempVector1 = new THREE.Vector3();
    tempVector2 = new THREE.Vector3();
    tempVector3 = new THREE.Vector3();
    tempLine = new THREE.Line3();
    inverseMatrix = new THREE.Matrix4();
    localPlane = new THREE.Plane();


    clippingPlanes: any = [
        new THREE.Plane(),
    ];;

    constructor(base: LineClip) {
        super(base)
        this.base = base
    }

    _init() {
        const gltf = this.base.am.resources['car']


        this.group = new THREE.Group()
        this.group.name = 'outLineClip'
        this.container.add(this.group)

        this.initClipPlane(this.group)

        const model = this.dealModel(gltf);

        const surfaceModel: any = model.clone();
        surfaceModel.material = new THREE.MeshStandardMaterial({
            depthFunc: THREE.EqualDepth,
        });
        surfaceModel.renderOrder = 1;

        const outlineLines = this.initLines(model)
        let frontSideModel = this.iniFrontModel(model)
        this.frontSideModel = frontSideModel
        let backSideModel = this.iniBackModel()
        this.backSideModel = backSideModel
        let { colliderBvh, colliderMesh, bvhHelper } = this.initBvh(model)
        this.colliderBvh = colliderBvh
        this.colliderMesh = colliderMesh
        this.bvhHelper = bvhHelper
        this.outlineLines = outlineLines;
        
        // debug
        // this.group.add(frontSideModel, backSideModel, surfaceModel, colliderMesh, bvhHelper, outlineLines);
        this.group.add(colliderMesh, outlineLines);

        // const box = new THREE.Box3();
        // box.setFromObject(this.frontSideModel);
        // box.getCenter(this.group.position).multiplyScalar(- 1);

        this.group.updateMatrixWorld(true);
        

        this.update = ()=>{
            this.renderThing();
        }

    }

    initClipPlane(scene: any) {
        this.planeMesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            stencilWrite: true,
            stencilFunc: THREE.NotEqualStencilFunc,
            stencilFail: THREE.ZeroStencilOp,
            stencilZFail: THREE.ZeroStencilOp,
            stencilZPass: THREE.ZeroStencilOp,
        }));
        this.planeMesh.scale.setScalar(1.5);
        (this.planeMesh.material as any).color.set(0x80deea).convertLinearToSRGB();
        this.planeMesh.renderOrder = 2;
        scene.add(this.planeMesh);
    }


    dealModel(gltf: any) {
        let mergedGeometry = new THREE.BufferGeometry();
        
        // 存储所有模型的几何体
        let geometries: any = [];
        gltf.scene.traverse((item: any) => {
            if (item.isMesh) {
                const instanceGeo = item.geometry.clone();
                instanceGeo.applyMatrix4(item.matrix);
                geometries.push(instanceGeo);
            }
        });

        // 合并几何体
        if (geometries.length > 0) {
            mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        }

        // 创建一个新的 Mesh 对象并设置合并后的几何体
        let mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshBasicMaterial());
        mergedMesh.scale.set(this.scaleValue, this.scaleValue, this.scaleValue)
        mergedMesh.position.y = -3.3
        mergedMesh.quaternion.identity();
        mergedMesh.applyMatrix4(gltf.scene.matrix)
        mergedMesh.rotation.set(0, Math.PI, 0); 
        mergedMesh.updateMatrixWorld(true);

        return mergedMesh
    }


    initLines(model: any) {
        // create line geometry with enough data to hold 100000 segments
        const lineGeometry = new THREE.BufferGeometry();
        const linePosAttr = new THREE.BufferAttribute(new Float32Array(300000), 3, false);
        linePosAttr.setUsage(THREE.DynamicDrawUsage);
        lineGeometry.setAttribute('position', linePosAttr);
        let outlineLines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial());
        outlineLines.material.color.set(0x00acc1)
        outlineLines.frustumCulled = false;
        outlineLines.renderOrder = 3;

        outlineLines.scale.copy(model.scale);
        outlineLines.position.copy(model.position);
        outlineLines.quaternion.copy(model.quaternion);
        

        return outlineLines
    }


    initBvh(model: any) {
        let mergedGeometry = model.geometry
        let colliderBvh = new MeshBVH(mergedGeometry, { maxLeafTris: 3 });
        mergedGeometry.boundsTree = colliderBvh;

        let colliderMesh: THREE.Mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshBasicMaterial({
            wireframe: false,
            transparent: true,
            opacity: 0.01,
            depthWrite: false,
        }));
        colliderMesh.renderOrder = 2;
        colliderMesh.position.copy(model.position);
        colliderMesh.rotation.copy(model.rotation);
        colliderMesh.visible = false
        colliderMesh.scale.copy(model.scale);

        let bvhHelper = new MeshBVHHelper(colliderMesh, parseInt(this.params.helperDepth));
        bvhHelper.depth = parseInt(this.params.helperDepth);
        bvhHelper.update();

        return { colliderBvh, colliderMesh, bvhHelper }
    }


    iniFrontModel(model: any) {
        const matSet = new Set();
        const materialMap = new Map();
        let frontSideModel = model;
        frontSideModel.updateMatrixWorld(true);
        frontSideModel.traverse((c: any) => {
            if (c.isMesh) {
                if (materialMap.has(c.material)) {
                    c.material = materialMap.get(c.material);
                    return;
                }
                matSet.add(c.material);
                const material = c.material.clone();
                material.color.set(0xffffff);
                material.roughness = 1.0;
                material.metalness = 0.0;
                material.side = THREE.FrontSide;
                material.stencilWrite = true;
                material.stencilFail = THREE.IncrementWrapStencilOp;
                material.stencilZFail = THREE.IncrementWrapStencilOp;
                material.stencilZPass = THREE.IncrementWrapStencilOp;
                material.clippingPlanes = this.clippingPlanes;

                materialMap.set(c.material, material);
                c.material = material;
            }
        });

        return frontSideModel
    }

    iniBackModel() {
        const matSet = new Set();
        const materialMap = new Map();
        let backSideModel = this.frontSideModel.clone();
        backSideModel.traverse((c: any) => {

            if (c.isMesh) {

                if (materialMap.has(c.material)) {

                    c.material = materialMap.get(c.material);
                    return;

                }

                const material = c.material.clone();
                material.color.set(0xffffff);
                material.roughness = 1.0;
                material.metalness = 0.0;
                material.colorWrite = false;
                material.depthWrite = false;
                material.side = THREE.BackSide;
                material.stencilWrite = true;
                material.stencilFail = THREE.DecrementWrapStencilOp;
                material.stencilZFail = THREE.DecrementWrapStencilOp;
                material.stencilZPass = THREE.DecrementWrapStencilOp;
                material.clippingPlanes = this.clippingPlanes;

                materialMap.set(c.material, material);
                c.material = material;

            }

        });

        return backSideModel
    }



    renderThing() {

        // make the outlines darker if the model is shown
        this.outlineLines.material.color
            .set(this.params.displayModel ? 0x3fffff : 0x3fffff)
        const delta = Math.min(this.base.clock.clock.getDelta(), 0.03);
        if (this.params.animate) {

            this.time += delta;

            if (this.params.animation === 'SPIN') {

                this.planeMesh.rotation.x = 0.25 * this.time;
                this.planeMesh.rotation.y = 0.25 * this.time;
                this.planeMesh.rotation.z = 0.25 * this.time;
                this.planeMesh.position.set(0, 0, 0);

            } else {

                // this.planeMesh.position.set(0, 0, 0);
                // this.planeMesh.rotation.set(0, Math.PI / 2, 0);

            }

            this.planeMesh.updateMatrixWorld();

        }

        const clippingPlane = this.clippingPlanes[0];
        clippingPlane.normal.set(0, 0, this.params.invert ? 1 : - 1);
        clippingPlane.constant = 0;
        clippingPlane.applyMatrix4(this.planeMesh.matrixWorld);

        // Perform the clipping
        if (this.colliderBvh && (this.params.animate || !this.initialClip)) {

            this.initialClip = true;

            // get the clipping plane in the local space of the BVH
            this.inverseMatrix.copy(this.colliderMesh.matrixWorld).invert();
            this.localPlane.copy(clippingPlane).applyMatrix4(this.inverseMatrix);

            let index = 0;
            const posAttr = this.outlineLines.geometry.attributes.position;
            const startTime = window.performance.now();
            this.colliderBvh.shapecast({
                intersectsBounds: (box:any) => {
                    // if we're not using the BVH then skip straight to iterating over all triangles
                    if (!this.params.useBVH) {
                        return CONTAINED;
                    }
                    return this.localPlane.intersectsBox(box);
                },
                intersectsTriangle: (tri:any) => {
                    // check each triangle edge to see if it intersects with the plane. If so then
                    // add it to the list of segments.
                    let count = 0;
                    this.tempLine.start.copy(tri.a);
                    this.tempLine.end.copy(tri.b);
                    if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
                        posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                        index++;
                        count++;

                    }

                    this.tempLine.start.copy(tri.b);
                    this.tempLine.end.copy(tri.c);
                    if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {

                        posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                        count++;
                        index++;

                    }

                    this.tempLine.start.copy(tri.c);
                    this.tempLine.end.copy(tri.a);
                    if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {

                        posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                        count++;
                        index++;

                    }

                    // When the plane passes through a vertex and one of the edges of the triangle, there will be three intersections, two of which must be repeated
                    if (count === 3) {

                        this.tempVector1.fromBufferAttribute(posAttr, index - 3);
                        this.tempVector2.fromBufferAttribute(posAttr, index - 2);
                        this.tempVector3.fromBufferAttribute(posAttr, index - 1);
                        // If the last point is a duplicate intersection
                        if (this.tempVector3.equals(this.tempVector1) || this.tempVector3.equals(this.tempVector2)) {

                            count--;
                            index--;

                        } else if (this.tempVector1.equals(this.tempVector2)) {

                            // If the last point is not a duplicate intersection
                            // Set the penultimate point as a distinct point and delete the last point
                            posAttr.setXYZ(index - 2, this.tempVector3);
                            count--;
                            index--;

                        }

                    }

                    // If we only intersected with one or three sides then just remove it. This could be handled
                    // more gracefully.
                    if (count !== 2) {

                        index -= count;

                    }

                },

            });

            // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
            this.outlineLines.geometry.setDrawRange(0, index);
            this.outlineLines.position.copy(clippingPlane.normal).multiplyScalar(- 0.00001);

            posAttr.needsUpdate = true;

            const delta = window.performance.now() - startTime;
            // outputElement.innerText = `${parseFloat(delta.toFixed(3))}ms`;

        }
    }
}