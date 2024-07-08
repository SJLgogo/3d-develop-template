import * as dayjs from "dayjs";
import { Queue, User } from "./personSimulation";

export class PassGate {

    userProcessQueue: Queue = new Queue();
    userOutQueue: Queue = new Queue();

    userQueue: Queue;

    gates: Gate[] = []

    parmas = {
        passGateTime: 1000, // 通过时间
        gateNum: 8, // 闸机
    }

    constructor({ userQueue }: { userQueue: Queue }) {
        this.userQueue = userQueue;
        for(let i=0 ;i<this.parmas.gateNum;i++){
            this.gates.push(
                {
                    status: 0,
                    in: { x: 1, y: 0 },
                    out: { x: 1, y: 5 },
                }
            )
        }
    }

    simulate() {
        let now = performance.now();
        const gates = this.gates;

        while (this.userQueue.size() > 0 || gates.filter(i => i.status == 1).length > 0) {
            const time = performance.now();
            const emptyGateNum = gates.filter(i => i.status == 0).length   // 未使用的闸机数
            const useGateNum = Math.min(emptyGateNum, this.userQueue.size());

            // 分配闸机
            for (let i = 0; i < useGateNum; i++) {
                const status = gates.map(i => i.status)
                const gate = Math.min(...status)
                const gateIndex = status.indexOf(gate);
                gates[gateIndex].status = 1;

                const user = this.userQueue.dequeue();
                user.timeRecord.push({ t: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), remark: '进闸', position: gates[gateIndex].in });
                this.userProcessQueue.enqueue(user);
            }

            // 出闸机
            if (time - now >= this.parmas.passGateTime) {
                const outUseGateNum = gates.filter(i => i.status == 1).length;
                for (let i = 0; i < outUseGateNum; i++) {
                    const status = gates.map(i => i.status)
                    const gate = Math.max(...status)
                    const gateIndex = status.indexOf(gate);
                    gates[gateIndex].status = 0;

                    const user = this.userProcessQueue.dequeue();
                    user.timeRecord.push({ t: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), remark: '出闸', position: gates[gateIndex].out  });
                    this.userOutQueue.enqueue(user);
                }
                now = performance.now()
            }
        }

        console.log('出闸人员队列:', this.userOutQueue);
        return this.userOutQueue

    }

}


interface Gate {
    status: number,
    in: { x: number, y: number },
    out: { x: number, y: number },
}




