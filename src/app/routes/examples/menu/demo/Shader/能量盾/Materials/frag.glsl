
varying float vIntensity;
varying vec2 vUv;

uniform sampler2D uNoiseTexture;
uniform vec3 uColor;
uniform float uTime;

void main(){

    vec2 uv = vUv;

    uv.y += (uTime * 0.0003);

    vec4 noiseColor = texture2D(uNoiseTexture , uv);

    gl_FragColor = vec4( noiseColor.rgb * vIntensity * uColor ,1.0);
}