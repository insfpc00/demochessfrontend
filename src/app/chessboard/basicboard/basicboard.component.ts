import { DragEvent } from './../chessboard.component';
import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FlipPositionPipe } from '../flip.pipe';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Piece, Position } from '../model/piece';
@Component({
  selector: 'app-basicboard',
  templateUrl: './basicboard.component.html',
  styleUrls: ['./basicboard.component.css', '../chessboard.component.css'],
  providers: [FlipPositionPipe],
  animations: [
    trigger('changePositionTrigger', [
      state('moving', style({ top: '{{topValue}}', left: '{{leftValue}}' }), {
        params: { leftValue: '0px', topValue: '0px' }
      }),
      state('moved', style({ top: '{{topValue}}', left: '{{leftValue}}' }), {
        params: { leftValue: '0px', topValue: '0px' }
      }),
      transition('moving => moved', [animate('0.2s')]),
      transition('moved => moving', [animate('0s')])
    ])
  ]
})
export class BasicboardComponent implements OnInit {


  @Output()
  dragEnd = new EventEmitter<DragEvent>();
  @Input()
  pieces: Piece[];
  @Input()
  fromMarkers: Position[];
  @Input()
  toMarkers: Position[];
  @Input()
  flippedBoard: boolean;
  @Input()
  blackDroppedPieces: Piece[];
  @Input()
  whiteDroppedPieces: Piece[];
  @Output()
  animationEnd = new EventEmitter<Piece>();
  @ViewChild('board') boardElement: ElementRef

  markers: Position[] = [];

  constructor(private flipPipe: FlipPositionPipe) { }

  onDragStart(event: PointerEvent, piece: Piece) {
    piece.draggingStartPosition.x = event.clientX;
    piece.draggingStartPosition.y = event.clientY;
    if (piece.isDraggable && !piece.beingDragged) {
      this.markers = piece.getAvailablePositions().map(p => this.flipPipe.transform(p, this.flippedBoard));
    }
    const initialFlippedPosition = this.flipPipe.transform(piece.getInitialPosition(), this.flippedBoard);
    const containerHeight = this.boardElement.nativeElement.clientHeight;
    const containerWidth = this.boardElement.nativeElement.clientWidth;
    piece.screen.x = event.clientX - piece.draggingStartPosition.x + initialFlippedPosition.x * 0.125 * containerWidth;
    piece.screen.y = event.clientY - piece.draggingStartPosition.y + initialFlippedPosition.y * 0.125 * containerHeight;

  }

  onDragEnd(event: PointerEvent, piece: Piece) {
    const containerHeight = this.boardElement.nativeElement.clientHeight;
    const containerWidth = this.boardElement.nativeElement.clientWidth;
    const x = 8 * piece.screen.x / containerWidth;
    const y = 8 * piece.screen.y / containerHeight;
    piece.setPosition(this.flipPipe.transform({ x, y }, this.flippedBoard));
    piece.fixPosition();
    piece.beingDragged = false;
    this.markers = [];
    this.dragEnd.emit({ pointerEvent: event, draggedPiece: piece });
  }

  onDragMove(event: PointerEvent, piece: Piece) {
    piece.beingDragged = true;

    const containerHeight = this.boardElement.nativeElement.clientHeight;
    const containerWidth = this.boardElement.nativeElement.clientWidth;
    //const containerWidth = (event.target as any).offsetParent.offsetWidth;
    const initialFlippedPosition = this.flipPipe.transform(piece.getInitialPosition(), this.flippedBoard);

    piece.screen.x = event.clientX - piece.draggingStartPosition.x + initialFlippedPosition.x * 0.125 * containerWidth;
    piece.screen.y = event.clientY - piece.draggingStartPosition.y + initialFlippedPosition.y * 0.125 * containerHeight;
  }

  onAnimationEnd(piece: Piece) {
    this.animationEnd.emit(piece);
  }
  ngOnInit() {
  }

  onHeightChange(height: number) {
    this.boardElement.nativeElement.height = height;
    this.boardElement.nativeElement.width = height;
    this.boardElement.nativeElement.style = 'height: ' + height + 'px; width: ' + height + 'px;';

  }




}
