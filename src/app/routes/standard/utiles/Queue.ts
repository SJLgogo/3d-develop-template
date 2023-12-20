export default class Queue {

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