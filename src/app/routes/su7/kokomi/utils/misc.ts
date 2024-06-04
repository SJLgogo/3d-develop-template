import * as THREE from "three";

const flatModel=(model:THREE.Object3D):THREE.Object3D[]=>{
    const modelPartsArray: THREE.Object3D[] = [];
    model.traverse((obj)=>{ 
        modelPartsArray.push(obj)
    })
    return modelPartsArray
}


// 打印扁平模型的所有部分
const printModel = (modelParts: THREE.Object3D[], modelName = "modelParts") => {
    const strArray = modelParts.map((obj, i) => {
      const row = `const ${obj.name} = ${modelName}[${i}];`;
      return row;
    });
    const str = strArray.join("\n");
    return str;
  };


  // 从hdr贴图中提取envmap , 从一个高动态范围（HDR）纹理生成环境贴图（environment map）
const getEnvmapFromHDRTexture = (
  renderer: THREE.WebGLRenderer,
  texture: THREE.Texture
) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envmap = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();
  return envmap;
};

/** 动画函数 */
const  easeInOutQuad = (t: number): number=> {
  if (t < 0.5) {
    return 2 * t * t;
  } else {
    return -1 + (4 - 2 * t) * t;
  }
}



export {
    flatModel,
    printModel,
    getEnvmapFromHDRTexture,
    easeInOutQuad
}