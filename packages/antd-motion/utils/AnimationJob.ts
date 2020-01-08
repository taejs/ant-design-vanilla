import { RAFJob } from "./rafJob";
import { exec } from "child_process";

export class AnimationJob extends RAFJob {
    duration : number;
    deactivationTime : number;
    block : (progress : number) => any;

    constructor (block, time, duration) {
        super(block, time);
        this.duration = duration;
    }
    start (startTime) {
        const f = (time) => {
            const progress = time-startTime;
            this.block(progress);
            if(progress < this.duration) requestAnimationFrame(f);
        }
        requestAnimationFrame(f);
    }
}
