import { RAFJob } from "./rafJob";
import { exec } from "child_process";

export class AnimationJob extends RAFJob {
    duration : number;
    deactivationTime : number;
    block : (progress : number) => any;

    constructor (block, time, duration) {
        super(block, time);
        this.duration = duration;
        this.deactivationTime = this.executionTime + this.duration;
    }
    start () {
        const isExecuting = time => this.executionTime <= time && time <= this.deactivationTime;
        const f = (time) => {
            if(!isExecuting(time)) return;
            this.block(this.invocationTime - time / this.duration);
            requestAnimationFrame(f);
        }
        requestAnimationFrame(f);
    }
}
