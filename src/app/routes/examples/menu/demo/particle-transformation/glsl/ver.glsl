varying float fOpacity;
varying vec3 vColor ;

void main(){
    
    vec4 mvPosition = modelViewMatrix*vec4(position,1.);

    gl_PointSize = 5.0;
    
    gl_Position= projectionMatrix* mvPosition;
}