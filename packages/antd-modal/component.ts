import AntModalFoundation from './foundation';

export class AntModal {
    private foundation;
    private root;

    constructor(root : Element){
        this.root = root;
        this.foundation = new AntModalFoundation(root);
        this.initialize();
    }

    initialize() {
        
    }
    
    open() {
        this.foundation.open();
    }

    close() {
        this.foundation.close();
    }
}