import { Base } from "../Base/base";
import { Component } from "./component";
import * as StatsImpl from 'stats.js';

export class Stats extends Component {
    
    stats:StatsImpl;

    constructor(base:Base){
        super(base)

        this.stats = new StatsImpl()
        this.base.container.appendChild(this.stats.dom)
    }

    update(time: number): void {
        this.stats.update();
    }
}