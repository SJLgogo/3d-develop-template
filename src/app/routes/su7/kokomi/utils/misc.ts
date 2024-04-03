
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
    console.log(str);
    return str;
  };



export {
    flatModel,
    printModel
}