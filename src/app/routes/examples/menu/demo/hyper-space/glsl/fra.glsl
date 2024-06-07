

varying vec3 vColor;
varying float fOpacity;

uniform vec3 color;
uniform sampler2D imgTexture;


void main(){
  vec2 center=vec2(.5,.5);// 圆心坐标
  vec2 coord = gl_PointCoord - center;
  float dist = length(coord);
  
  if(dist>.5){
    discard;
  }

  gl_FragColor=vec4(color * vColor ,fOpacity);
  
  gl_FragColor = gl_FragColor * texture2D(imgTexture, gl_PointCoord);

}
