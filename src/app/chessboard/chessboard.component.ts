import { BasicboardComponent } from './basicboard/basicboard.component';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Piece, Position } from './model/piece';
import { FlipPositionPipe } from './flip.pipe';
import { Match } from '../model/match.model';
import { ResizeEvent } from 'angular-resizable-element';
import { PlayerpanelComponent } from './playerpanel/playerpanel.component';
import { soundServiceProvider } from '../core/sound.service.provider';

export interface DragEvent {
  pointerEvent: PointerEvent;
  draggedPiece: Piece;
}

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css'],
})

export class ChessboardComponent implements OnInit, AfterViewInit {

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
  match: Match;
  @Input()
  blackDroppedPieces: Piece[];
  @Input()
  whiteDroppedPieces: Piece[];
  @Output()
  animationEnd = new EventEmitter<Piece>();
  @Output()
  flippedBoardChange = new EventEmitter<boolean>();

  @ViewChild('board') board!: BasicboardComponent;

  @ViewChild('whitesPanel') whitesPanel!: PlayerpanelComponent;
  @ViewChild('blacksPanel') blacksPanel!: PlayerpanelComponent;

  markers: Position[] = [];

  constructor(private cd: ChangeDetectorRef, private flipPipe: FlipPositionPipe) { }

  public update(piece: Piece) {
    // this.cd.markForCheck();
  }


  onResizeEnd(event: ResizeEvent): void {
    /*   this.style = {
        position: 'fixed',
        left: `${event.rectangle.left}px`,
        top: `${event.rectangle.top}px`,
        width: `${event.rectangle.width}px`,
        height: `${event.rectangle.height}px`
      }; */
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.board.dragEnd.subscribe(event => { this.dragEnd.emit(event)});
    this.board.animationEnd.subscribe( event=> this.animationEnd.emit(event));
  }
  switchSides() {
    const flipp = (p: Position) => ({ x: 7 - p.x, y: 7 - p.y });
    this.flippedBoard = !this.flippedBoard;
    this.flippedBoardChange.emit(this.flippedBoard);
    //this.pieces.forEach(p => p.flipped = this.flippedBoard);
    if (this.toMarkers) {
      this.toMarkers.map(p => flipp(p));
    }
    if (this.fromMarkers) {
      this.fromMarkers.map(p => flipp(p));
    }
  }
}
