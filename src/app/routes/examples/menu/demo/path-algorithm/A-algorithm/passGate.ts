import * as dayjs from "dayjs";
import { PathAlgorithm } from "../World/PathAlgorithm";

export class PassGate {

  
    userNum:number = 21

    userGateQueue:Queue=new Queue();
    userProcessQueue:Queue=new Queue();
    userOutQueue:Queue=new Queue();


    parmas = {
        passGateTime: 1000, // 通过时间
        gateNum: 4, // 闸机
        passGateUser: this.userNum  // 过闸人数
    }


    base:PathAlgorithm;

    constructor(base:PathAlgorithm) {
        this.base = base

        for (let index = 0; index < this.userNum; index++) {
            this.userGateQueue.enqueue(new User('user_'+index))
        }

    }

    simulate() {
        const gates = new Array(this.parmas.gateNum).fill(0)
        let now = performance.now();


        while (this.parmas.passGateUser > 0 || gates.filter(i => i == 1).length > 0) {
            const time = performance.now();
            const emptyGateNum = gates.filter(i => i == 0).length   // 未使用的闸机数
            const useGateNum = Math.min(emptyGateNum, this.parmas.passGateUser); 

            // 分配闸机
            for (let i = 0; i < useGateNum; i++) {
                const gate = Math.min(...gates)
                const gateIndex = gates.indexOf(gate);
                gates[gateIndex] = 1;

                const user = this.userGateQueue.dequeue();
                user.timeRecord.push({t:dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') , remark:'进闸'});
                this.userProcessQueue.enqueue(user);
                
                this.parmas.passGateUser--
            }

            // 出闸机
            if (time - now >= this.parmas.passGateTime) {
                const outUseGateNum = gates.filter(i => i == 1).length;
                for (let i = 0; i < outUseGateNum; i++) {
                    const gate = Math.max(...gates)
                    const gateIndex = gates.indexOf(gate);
                    gates[gateIndex] = 0;

                    const user = this.userProcessQueue.dequeue();
                    user.timeRecord.push({t:dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') , remark:'出闸'});
                    this.userOutQueue.enqueue(user);
                }
                now = performance.now()
            }

        }


    }

}


class User{

    timeRecord:timeRecord[] ;

    userId:string;

    constructor(userId:string){
        this.userId = userId ;
        this.timeRecord = [{t:dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') , remark:'init'}];
    }
}

interface timeRecord{
    t:string,
    remark:string
}


class Queue {

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