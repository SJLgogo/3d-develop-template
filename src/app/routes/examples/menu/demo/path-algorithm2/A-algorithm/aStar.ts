
export const aStar = ( start: number[], end: number[] , defaultY:number = 0) => {
    const closedSet = new Set<string>();
    const openSet = new PriorityQueue<Node>();
    const startNode = new Node(start[0], defaultY, start[1]);
    const goalNode = new Node(end[0], defaultY, end[1]);

    openSet.put(0, startNode); // 将起点加入优先队列

    while (!openSet.empty()) {
        const currentNode: Node = openSet.get()!; // 从队列中取出当前优先级最高的节点

        if (currentNode.x == goalNode.x && currentNode.z == goalNode.z) {
            const path: [number, number, number][] = [];
            let current: Node | null = currentNode;

            while (current !== null) {
                path.unshift([current.x, defaultY, current.z]);
                current = current.parent;
            }
            return path;
        }

        const neighbors = getNeighbors(currentNode);

        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.x}-${neighbor.z}`;
            if (!closedSet.has(neighborKey)) {
                // console.log(currentNode);
                const tentativeG = currentNode.g + 1; // 实际代价
                if (!openSet.elements.some(([_, n]) => n.x === neighbor.x && n.z === neighbor.z)) {

                    neighbor.g = tentativeG;
                    const randomBias = Math.random() * 10 ; // 显著的随机偏差
                    neighbor.h = manhattanDistance([neighbor.x, neighbor.z], [goalNode.x, goalNode.z]); // 启发式代价
                    neighbor.f = neighbor.g + neighbor.h + randomBias;
                    neighbor.parent = currentNode;

                    if (!openSet.elements.some(([_, n]) => n.x === neighbor.x && n.z === neighbor.z)) {
                        openSet.put(neighbor.f, neighbor); // 将邻居节点加入优先队列
                    }
                }
            }
        }
        closedSet.add(`${currentNode.x}-${currentNode.z}`);
        // console.log(openSet, closedSet);
    }
    return [];
}


// 曼哈顿距离计算函数
const manhattanDistance = (point1: [number, number], point2: [number, number]): number => {
    const dx = Math.abs(point1[0] - point2[0]);
    const dy = Math.abs(point1[1] - point2[1]);
    return dx + dy;
}

// 获取周围点
const getNeighbors = (node: any) => {
    const neighbors = [];
    const standard  = 50
    const directions8 = [
        { x: -standard, y: 0 }, { x: standard, y: 0 }, 
        { x: 0, y: -standard }, { x: 0, y: standard }, 
        { x: -standard, y: -standard }, { x: standard, y: -standard }, { x: -standard, y: standard }, { x: standard, y: standard } // 对角线
    ];

    const directions4level = [
        { x: 0, y: -standard }, { x: 0, y: standard }, 
        { x: -standard, y: 0 }, { x: standard, y: 0 }, 
    ];

    const directions4Vertical = [
        { x: -standard, y: 0 }, { x: standard, y: 0 },
        { x: 0, y: -standard }, { x: 0, y: standard }, 
    ];

    const directions = Math.random() > 0.5 ? directions4level : Math.random() > 0.5 ? directions8 : directions4Vertical;


    for (let dir of directions) {
        const newX = node.x + dir.x;
        const newZ = node.z + dir.y;
        // x , z 方向范围 
        if (newX >= -500 && newX <= 500 && newZ >= -500 && newZ <= 500 && !Platform.collisionDetection(newX, newZ)) {
            neighbors.push(new Node(newX, 0, newZ));
        }
    }

    return neighbors;
}


class PriorityQueue<T> {
    elements: [number, T][] = [];

    putNum: number = 0;

    // 添加元素到队列
    put(priority: number, element: T): void {
        this.putNum++
        this.elements.push([priority, element]);
        this.elements.sort((a, b) => a[0] - b[0]); // 根据优先级排序

    }

    // 从队列中取出最优先的元素
    get(): T | undefined {
        return this.elements.shift()?.[1];
    }

    // 判断队列是否为空
    empty(): boolean {
        return this.elements.length === 0;
    }
}

export class Node {

    x: number = 0;
    y: number = 0;
    z: number = 0;
    g: number = 0; // 实际代价
    h: number = 0; // 启发式代价
    f: number = 0; // 总代价
    parent: Node | null = null;

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }


}


class Platform {
    static obstacles: [number, number, number, number][] = [
        
    ];

    //碰撞检测
    static collisionDetection(x: number, z: number): boolean {
        let checkResult = false;
        for (let i = 0; i < this.obstacles.length; i++) {
            checkResult = (x >= this.obstacles[i][0] && x <= this.obstacles[i][2]) && (z >= this.obstacles[i][3] && z <= this.obstacles[i][1]);
            if (checkResult) break; //碰撞了
        }
        return checkResult;
    }
}