import { AnimationJob } from "./utils/AnimationJob";
import BezierEasing from 'bezier-easing';

export class AntdWaveShadow  {
    root : HTMLElement;
    adapter : any;
    animationQueue : Set<AnimationJob>
    disabled : boolean;

    private handleContainerClick : EventListener;

    constructor(root : HTMLElement) {
        this.root = root;
        this.disabled = false;
        this.adapter = AntdWaveShadow.createAdapter(this);
        this.animationQueue = new Set();
        this.handleContainerClick = () =>this.activate();
        this.initialSyncWithDOM();
    }
    
    static attachTo(root : HTMLElement) : AntdWaveShadow {
        return new AntdWaveShadow(root);
    }

    static createAdapter(instance : AntdWaveShadow): any {
        return {
            isLayerDisabled: ()=>Boolean(instance.disabled),
            addClass: (className) => instance.root.classList.add(className),
            containsEventTarget: (target) => instance.root.contains(target as Node),
            deregisterDocumentInteractionHandler: (evtType, handler) =>
                document.documentElement.removeEventListener(evtType, handler),
            deregisterInteractionHandler: (evtType, handler) =>
                (instance.root as HTMLElement).removeEventListener(evtType, handler),
            registerDocumentInteractionHandler: (evtType, handler) =>
                document.documentElement.addEventListener(evtType, handler),
            registerInteractionHandler: (evtType, handler) =>
            (instance.root as HTMLElement).addEventListener(evtType, handler),
            removeClass: (className) => instance.root.classList.remove(className),
            updateCssVariable: (varName, value) => (instance.root as HTMLElement).style.setProperty(varName, value),
        };
      }

      activate(){
        if(this.adapter.isLayerDisabled()) return;
        const easing = BezierEasing(0.08, 0.82, 0.17, 1);
        const animationWave = (progress) => {
            const MAX_SPREAD = 6;
            progress = (easing(progress / 400)).toFixed(2);
            let spread = MAX_SPREAD * progress;
            this.adapter.updateCssVariable('box-shadow', `0px 0px 0px ${spread}px rgba(24, 144, 255, 0.2)`);
        }
        const animationFadeOut = (progress) => {
            progress = (easing(progress / 2000)).toFixed(2);
            console.log(progress);
            let opacity = 1 - progress;
            this.adapter.updateCssVariable('opacity', opacity);
        }
        this.animationQueue.add(new AnimationJob(animationFadeOut, 0, 2000));
        this.animationQueue.add(new AnimationJob(animationWave, 0, 400));

        const f = (time) => {
            this.animationQueue.forEach(item => {
                if(item.executionTime > time) return;
                this.animationQueue.delete(item);
                item.start(time);
            });
            requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      }

      deactivate() {
          this.adapter.deregisterInteractionHandler('click', this.handleContainerClick);
      }

    initialSyncWithDOM() {
        const root = this.root as HTMLElement;
        this.adapter.registerInteractionHandler('click',  this.handleContainerClick);
        this.disabled = root.hasAttribute('disabled');
    }
}