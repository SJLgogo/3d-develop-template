import { Component } from "src/app/routes/su7/kokomi/components/component";
import { Huiztech } from "../Huiztech";
import { flatModel } from "src/app/routes/su7/kokomi/utils/misc";

export class Station extends Component {

    base!:Huiztech;

    model:any;

    modelParts: THREE.Object3D[];
    
    constructor(base:Huiztech){
        super(base)

        this.model = this.base.am.resources['wuhu']

        const modelParts = flatModel(this.model );
        this.modelParts = modelParts
        // console.log(modelParts);

        this.base.interactionManager.add(this.model);
    }




    addExisting(){
        this.container.add(this.model)
    }
}