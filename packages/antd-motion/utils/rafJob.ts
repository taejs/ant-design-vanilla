export class RAFJob {
    invocationTime : number;
    executionTime: number;
    block : Function;

    constructor (block, time) {
        this.block = block;
        this.invocationTime = performance.now();
        this.executionTime = this.invocationTime + time;
    }
}
