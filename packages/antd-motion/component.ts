import {cssClasses, numbers} from './constants';

export class AntdWaveShadow  {
    protected root : HTMLElement;
    private adapter : any;
    private disabled : boolean;
    private handleContainerClick : EventListener;
    private activationTimer : NodeJS.Timeout;

    constructor(root : HTMLElement) {
        this.root = root;
        this.disabled = false;
        this.adapter = AntdWaveShadow.createAdapter(this);
        this.handleContainerClick = () =>this.activate();
        this.initialSyncWithDOM();
        this.init();
    }
    
    init() {
        this.adapter.registerInteractionHandler('click',  this.handleContainerClick);
    }

    destroy() {
        clearTimeout(this.activationTimer);
        this.adapter.deregisterInteractionHandler('click', this.handleContainerClick);
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
        if(this.activationTimer) {
            this.activationTimer = null;
            clearTimeout(this.activationTimer);
        }

        this.adapter.removeClass(cssClasses.WAVE_ACTIVATION);
        requestAnimationFrame(()=>{
          this.adapter.addClass(cssClasses.WAVE_ACTIVATION);
        });

        this.activationTimer = setTimeout(()=> {
          this.adapter.removeClass(cssClasses.WAVE_ACTIVATION);
          this.activationTimer = null;
        }, numbers.ANIMATING_DURATION_MS);
    }

    private initialSyncWithDOM() {
        const root = this.root as HTMLElement;
        this.disabled = root.hasAttribute('disabled');
    }
}