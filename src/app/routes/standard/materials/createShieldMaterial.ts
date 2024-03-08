import { Color, DoubleSide, ShaderMaterial } from 'three'


export default function (color: Color = new Color('red')) {
    return new ShaderMaterial({
        transparent: true,
        side: DoubleSide,
        // 顶点着色器
        vertexShader: `
        varying vec3 vModelPosition;

        void main () {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewMatrix * modelPosition;  // 必须这样固定设置才能显示
        
            vModelPosition = modelPosition.xzy;
        }
        `,
        // 片元着色器
        fragmentShader: `
        uniform float uHeight;
        uniform vec3 uColor;

        varying vec3 vModelPosition;

        void main () {
            float opacity = vModelPosition.z / (uHeight + 0.1);
            opacity = 1.0 - opacity;
            opacity *= .4;

            if (vModelPosition.z > (uHeight - .1) || vModelPosition.z < 0.25) {
                discard;
            }

            gl_FragColor = vec4(uColor, opacity);   
        }
        `,
        uniforms: {
            uColor: {
                value: color
            },
            uHeight: {
                value: 10
            }
        }
    })
}