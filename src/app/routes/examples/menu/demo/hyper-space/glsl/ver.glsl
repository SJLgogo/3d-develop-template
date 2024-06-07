attribute float vertexOpacity;
attribute float size;
attribute vec3 customColor;

varying float fOpacity;
varying vec3 vColor ;

void main(){
    
    vec4 mvPosition = modelViewMatrix*vec4(position,1.);

    gl_PointSize = size * (300.0 / length(mvPosition.xyz));
    
    fOpacity=vertexOpacity;
    vColor = customColor;
    
    gl_Position=projectionMatrix*mvPosition;
}