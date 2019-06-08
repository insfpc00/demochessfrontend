import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[resize]'
})
export class ResizeDirective {

  @Output() heightChange = new EventEmitter<number>();

  @HostListener('load', ['$event.target'])
  onLoad(target) {
    target.height = Math.round(target.height / 100) * 100;
    target.width = Math.round(target.width / 100) * 100;
    target.style = 'height: ' + target.height + 'px; width: ' + target.width + 'px;';
    this.heightChange.emit(target.height);
  }

  @HostListener('resize', ['$event.target'])
  onResize(target) {
    //target.height = Math.round(target.height / 100) * 100 ;
    //target.width = Math.round(target.width / 100) * 100 ;
  }


  constructor() { }

}
