import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {

  @HostBinding('class.draggable') draggable = true;

  @Output()
  dragStart = new EventEmitter<PointerEvent>();
  @Output()
  dragMove = new EventEmitter<PointerEvent>();
  @Output()
  dragEnd = new EventEmitter<PointerEvent>();

  private dragging = false;

  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent): void{
    this.dragging = true;
    this.dragStart.emit(event);
  }

  @HostListener('document:pointermove', ['$event', 'data']) onPointerMove(event: PointerEvent): void{
    if (!this.dragging){
      return;
    }
    this.dragMove.emit(event);
  }

  @HostListener('document:pointerup', ['$event']) onPointerUp(event: PointerEvent): void{
    if (!this.dragging){
      return;
    }
    this.dragging = false;
    this.dragEnd.emit(event);
  }

  constructor() { }

}
