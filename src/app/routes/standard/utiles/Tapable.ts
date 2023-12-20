import { AsyncParallelHook, SyncHook } from 'tapable';

class Tapable {

    _hooks: any = {
        userHook: new SyncHook(['params']),
    }

    constructor() {
    }

}


export const tapable = new Tapable()