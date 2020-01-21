class AntModalFoundation {
  private root : Element;
  private isOpen_ = false;

  constructor(root : Element) {
    this.root = root;
  }

  get isOpen() {
    return this.isOpen_;
  }

  open() {
    this.isOpen_ = true; 
    (this.root as HTMLElement).style.setProperty('display', 'block');
  }

  close() {
    this.isOpen_ = false;
    (this.root as HTMLElement).style.setProperty('display', 'none');
  }

  handleClick(evt : MouseEvent) {
    const isMask = (evt.target as Element).classList.contains('ant-modal__mask');
    if(isMask) this.close();
  }
}
export default AntModalFoundation;