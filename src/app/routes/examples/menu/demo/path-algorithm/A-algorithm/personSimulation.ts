import * as dayjs from "dayjs";
import { PassGate } from "./passGate"
import { PassEscalator } from "./passEscalator";
import { ASimulate } from "./aSimulate";

export class PersonSimluation {

    config = {
        userNum: 20,
        rows: 100,
        cols: 100
    }

    posList: any[] = []

    passGate: PassGate;

    initUserQueue = new Queue()
    constructor() {
        this.initPosList();
        for (let index = 0; index < this.config.userNum; index++) {
            this.initUserQueue.enqueue(new User('user_' + index))
        }

        const passGate = new PassGate({ userQueue: this.initUserQueue });
        this.passGate = passGate;
    }

    // 生成位置图
    initPosList() {
        const positions = [], { rows, cols } = this.config;
        for (let x = 0; x < rows; x++) {
            const row = [];
            for (let y = 0; y < cols; y++) {
                row.push({ x: x, y: y });
            }
            positions.push(row);
        }
        this.posList = positions;
    }

    simulate() {
        const userPassGateQueue = this.passGate.simulate();

        const aSimulate= new ASimulate({ userQueue: userPassGateQueue })
        const aQueue =  aSimulate.simulate()

        const passEscalator = new PassEscalator({ userQueue: aQueue });
        passEscalator.simulate()

    }

}


export class Queue {

    items: any[] = []

    constructor() {

    }

    enqueue(element: any) {
        this.items.push(element);
    }

    dequeue() {
        return this.items.shift();
    }

    peek() {
        return this.items[0];
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

}

export class User {

    timeRecord: timeRecord[];

    userId: string;

    constructor(userId: string) {
        this.userId = userId;
        this.timeRecord = [{ t: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), remark: 'init', position: { x: 0, y: 0 } }];
    }
}


export interface timeRecord {
    t: string,
    remark: string,
    position: { x: number, y: number },
    path?:[]
}




