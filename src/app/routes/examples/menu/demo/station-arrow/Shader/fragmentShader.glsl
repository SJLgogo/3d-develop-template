varying vec2 vUv;
uniform sampler2D arrowTexture;
uniform float uScrollYSpeed;
uniform float iTime;

void main(){
    vec2 uv=vUv;
    uv.y=fract(uv.y-uScrollYSpeed*iTime);//计算浮点数的小数部分 可以用于循环纹理坐标
    vec4 col= texture2D(arrowTexture,uv);

    gl_FragColor=col;
}