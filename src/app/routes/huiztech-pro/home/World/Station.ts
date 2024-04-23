import { Component } from "src/app/routes/su7/kokomi/components/component";
import { Huiztech } from "../Huiztech";

export class Station extends Component {

    base!:Huiztech;

    model:any;
    
    constructor(base:Huiztech){
        super(base)

        this.model = this.base.am.resources['wuhu']
    }




    addExisting(){
        this.container.add(this.model)
    }
}