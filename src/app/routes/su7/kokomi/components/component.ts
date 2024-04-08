import { Base } from "../Base/base";
import mitt from "mitt";


class Component{

    base:Base;
    container: THREE.Scene;
    emitter:any;

    constructor(base:Base){
        this.base = base;
        this.container = this.base.scene;
        
        this.base.update((time: number) => this.update(time));

        this.emitter = mitt();
    }

    update(time: number) {
        1+1
    }

    // 监听事件
    on(type: string, handler: any) {
        this.emitter.on(type, handler);
    }
    // 移除事件
    off(type: string, handler: any) {
        this.emitter.off(type, handler);
    }
    // 触发事件
    emit(type: string, event: any = {}) {
        this.emitter.emit(type, event);
    }
}


export { Component }