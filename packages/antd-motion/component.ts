import { AnimationJob } from "./utils/AnimationJob";

export class AntdWaveShadow  {
    root : HTMLElement;
    adapter : any;
    disabled : boolean = false;
    animationQueue : Set<AnimationJob>

    private handleContainerClick : EventListener;

    constructor(root) {
        this.root = root;
        this.adapter = AntdWaveShadow.createAdapter(this);
        this.animationQueue = new Set();
        this.handleContainerClick = () =>this.activate;
    }
    
    static attachTo(root : Element) : AntdWaveShadow {
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
                (instance.root_ as HTMLElement).removeEventListener(evtType, handler),
            registerDocumentInteractionHandler: (evtType, handler) =>
                document.documentElement.addEventListener(evtType, handler),
            registerInteractionHandler: (evtType, handler) =>
            (instance.root_ as HTMLElement).addEventListener(evtType, handler),
            removeClass: (className) => instance.root_.classList.remove(className),
            updateCssVariable: (varName, value) => (instance.root_ as HTMLElement).style.setProperty(varName, value),
        };
      }

      activate(){
        if(this.adapter.isLayerDisabled) return;
        const animationWave = (progress) => {
            const MAX_SPREAD = 6;
            let spread = MAX_SPREAD * progress;
            this.adapter.updateCssVariable('box-shadow', `0px 0px 0px ${spread}px inherit`);
        }
        this.animationQueue.add(new AnimationJob(animationWave, 0, 300));

        const f = (time) => {
            this.animationQueue.forEach(item => {
                if(item.executionTime > time) return;
                this.animationQueue.delete(item);
                item.start();
            });
            requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
        //this.animationQueue.add(new RAFJob(animationFadeOut,  300));
      }

      deactivate() {
          this.adapter.deregisterDocumentInteractionHandler('click', this.handleContainerClick);
      }

    initialSyncWithDOM() {
        const root = this.root as HTMLElement;
        this.adapter.registerDocumentInteractionHandler('click',  this.handleContainerClick);
        this.disabled = root.hasAttribute('disabled');
    }
}