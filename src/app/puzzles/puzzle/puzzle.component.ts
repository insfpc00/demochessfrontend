import { soundServiceProvider } from './../../core/sound.service.provider';
import { EndDialogComponent, puzzleResult } from './enddialog/enddialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from './../../chessboard/model/board/boardservice';
import { PuzzleService, Puzzle, MoveResponse } from './../../core/puzzle.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Piece } from 'src/app/chessboard/model/piece';
import { Move } from 'src/app/chessboard/model/move';
import { ClockComponent } from 'src/app/clock/clock.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css'],
  providers: [BoardService, soundServiceProvider]
})
export class PuzzleComponent implements OnInit, AfterViewInit {

  wrongMoves: number;
  tipsShowed: string[];
  tipsAvailable: boolean;
  goodMove: boolean;
  puzzle: Puzzle;
  private _puzzleLabel: string;
  currentTip = 0;
  @ViewChild('clock')
  clock!: ClockComponent;
  /*  @Input()
   set puzzle(puzzle) {
     this._puzzle = puzzle;
     this.initBoard();
   }
   get puzzle(): Puzzle {
     return this._puzzle;
   }*/

  constructor(public board: BoardService, private puzzleService: PuzzleService,
    private route: ActivatedRoute, public matDialog: MatDialog,  private router: Router) {
    this.route.params.subscribe(params => this._puzzleLabel = params.puzzle); // Object {}
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  private initBoard() {
    this.board.loadFromFen(this.puzzle.startingFen, this.puzzle.firstMove === null);
    if (this.puzzle.firstMove !== null) {
      this.board.doMove(this.puzzle.firstMove);
    }
    this.wrongMoves = 0;
    this.tipsAvailable = this.puzzle.tips && this.puzzle.tips.length > 0;
    this.tipsShowed = [];
    this.goodMove = null;
    setTimeout(() => {
      this.clock.start();
    }, 0);
  }
  ngOnInit() {
    this.goodMove = null;
    this.puzzleService.play(this._puzzleLabel).subscribe(puzzle => {
      this.puzzle = puzzle;
      this.initBoard();
    });
  }

  onDragEnd(event: PointerEvent, piece: Piece) {
    if (this.board.isMyTurn) {
      this.board.tryToMovePiece(piece, (m: Move) => this.sendMove(m));
    } else {
      piece.cancelDrag();
    }
  }

  sendMove(move: Move) {
    this.puzzleService.move(this.puzzle.label, move).subscribe(
      (m: MoveResponse) => {
        if (!m.finalMove) {
          this.board.doMove(m.move);
        } else {
          this.endPuzzle(puzzleResult.SOLVED);
        }
      },
      error => {
        this.goodMove = false;
        this.board.undoLastMove();
        this.wrongMoves++;
        if (this.wrongMoves > this.puzzle.numberOfWrongMovesAllowed) {
          this.endPuzzle(puzzleResult.ERRORS_EXCEEDED);
        }
      });
  }

  showTip() {
    if (this.puzzle.tips && this.tipsShowed.length < this.puzzle.tips.length) {
      this.tipsShowed.push(this.puzzle.tips[this.tipsShowed.length]);
      this.tipsAvailable = this.tipsShowed.length < this.puzzle.tips.length;
    }
  }
  timeRanOut() {
    this.endPuzzle(puzzleResult.TIMEDOUT);
  }

  endPuzzle(result: number) {
    this.clock.stop();
    const dialogRef = this.matDialog.open(EndDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: result
    });
    dialogRef.afterClosed().subscribe(reload => {
      if (reload) { this.ngOnInit(); }
    });
  }

  goBack() {
    this.router.navigate(['/puzzles']);
  }

}
