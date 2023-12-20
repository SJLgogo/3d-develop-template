import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, Group, Line, LineBasicMaterial, Points, PointsMaterial, Vector3 } from "three";

export default class FlowLight {

    linePointNum: number = 100

    lightPointNum: number = 100

    num: number = 15

    main: Group = new Group();

    line: Vector3[] = [new Vector3(0, 0, 0), new Vector3(100, 100, 100), new Vector3(200, 0, 200)]

    lineList: any[] = []

    constructor() {

    }


    build(): void {
        this.addLine()
    }


    addLine(): void {
        const geometry = new BufferGeometry()
        const curve = new CatmullRomCurve3(this.line)
        const points = curve.getSpacedPoints(this.linePointNum)
        geometry.setFromPoints(points)
        const material = new LineBasicMaterial({
            color: '#00ffff',
        })
        const line = new Line(geometry, material)
        this.main.add(line)


        let index = 0
        const lightGeometry: any = new BufferGeometry()
        const percentArr = [] // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
        for (let i = 0; i < this.lightPointNum; i++) {
            percentArr.push(i / this.lightPointNum)
        }
        const percentAttribue = new BufferAttribute(new Float32Array(percentArr), 1)
        lightGeometry.attributes.percent = percentAttribue
        // 批量计算所有顶点颜色数据
        const colorArr = []
        for (let i = 0; i < this.lightPointNum; i++) {
            const color1 = new Color(0x006666)
            const color2 = new Color(0xffff00)
            const color = color1.lerp(color2, i / this.lightPointNum)
            colorArr.push(color.r, color.g, color.b)
        }
        // 设置几何体顶点颜色数据
        lightGeometry.attributes.color = new BufferAttribute(new Float32Array(colorArr), 3)

        // 点模型渲染几何体每个顶点
        const pointsMaterial = new PointsMaterial({
            color: '#ffff00',
            size: 1.0, //点大小
        })
        const flyPoints = new Points(lightGeometry, pointsMaterial)
        this.main.add(flyPoints)

        // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
        pointsMaterial.onBeforeCompile = function (shader) {
            // 顶点着色器中声明一个attribute变量:百分比
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                [
                    'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
                    'void main() {',
                ].join('\n'), // .join()把数组元素合成字符串
            )
            // 调整点渲染大小计算方式
            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size;',
                ['gl_PointSize = percent * size;'].join('\n'), // .join()把数组元素合成字符串
            )
        }
        const maxIndex = points.length - 5
        const lineObject = {
            points,
            lightGeometry,
            index,
            maxIndex,
        }
        this.lineList.push(lineObject)


        this.startAnimation(lineObject)
    }



    startAnimation(lineObject: any) {
        if (lineObject.index > lineObject.maxIndex) lineObject.index = 0
        lineObject.index += 1
        const nextLinePoints = lineObject.points.slice(lineObject.index, lineObject.index + this.num)
        const curve = new CatmullRomCurve3(nextLinePoints)
        const newLinePoints = curve.getSpacedPoints(this.lightPointNum)
        lineObject.lightGeometry.setFromPoints(newLinePoints)
        requestAnimationFrame(this.startAnimation.bind(this, lineObject))
    }
}