import { AnalysisService, MovesOpeningPair } from './../core/analysis.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Pawn } from '../chessboard/model/pawn';
import { Rook } from '../chessboard/model/rook';
import { Horse } from '../chessboard/model/horse';
import { Bishop } from '../chessboard/model/bishop';
import { Queen } from '../chessboard/model/queen';
import { King } from '../chessboard/model/king';
import { Piece, Position, pieceType } from '../chessboard/model/piece';
import { UserService } from '../core/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../core/matchservice.service';
import { Match } from '../model/match.model';
import { Observable, timer, Subscription } from 'rxjs';
import { MoveDto, MoveAnalysis } from '../chessboard/model/move';
import { FlipPositionPipe } from '../chessboard/flip.pipe';
import { formatPosition } from '../utils/utils';
import { SoundService } from '../core/sound.service';
import { ChessboardComponent } from '../chessboard/chessboard.component';
import { soundServiceProvider } from '../core/sound.service.provider';

const analysesHead: MoveAnalysis = {
  bestMove: 'Starting position',
  score: 0.0
};

@Component({
  selector: 'app-analysisboard',
  templateUrl: './analysisboard.component.html',
  styleUrls: ['./analysisboard.component.css'],
  providers: [FlipPositionPipe, soundServiceProvider]

})
export class AnalysisBoardComponent implements OnInit {

  flattenPieces: Piece[];
  flippedBoard: boolean;
  pieces: Piece[][] = new Array();
  match$: Observable<Match>;
  match: Match;
  moves: MoveDto[] = [];
  private _currentMove = 0;
  playing = false;
  timerSusc: Subscription;
  toMarkers: Position[] = new Array();
  fromMarkers: Position[] = new Array();
  private _droppedPieces = [];
  whiteDroppedPieces: Piece[] = [];
  blackDroppedPieces: Piece[] = [];
  acnMoves = [];
  openings: string[] = [];
  private _promotedPieces = [];
  private _promotionPendingdPieces = [];

  @ViewChild('chessboard') chessBoard!: ChessboardComponent;
  analysisRequested: boolean;
  analysis: MoveAnalysis[];
  get currentMove() {
    return this._currentMove >= this.moves.length ? this.moves.length : this._currentMove;
  }

  constructor(private matchService: MatchService,
              private route: ActivatedRoute,
              public userService: UserService,
              public flipPipe: FlipPositionPipe,
              private analysisService: AnalysisService,
              private soundService: SoundService) {

    this.analysisRequested = false;

  }

  private initPieces(): void {

    this.pieces[0] = [
      new Rook(false, { y: 0, x: 0 }, this.pieces, false),
      new Horse(false, { y: 0, x: 1 }, this.pieces, false),
      new Bishop(false, { y: 0, x: 2 }, this.pieces, false),
      new Queen(false, { y: 0, x: 3 }, this.pieces, false),
      new King(false, { y: 0, x: 4 }, this.pieces, false),
      new Bishop(false, { y: 0, x: 5 }, this.pieces, false),
      new Horse(false, { y: 0, x: 6 }, this.pieces, false),
      new Rook(false, { y: 0, x: 7 }, this.pieces, false)
    ];

    this.pieces[1] = [
      new Pawn(false, { y: 1, x: 0 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 1 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 2 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 3 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 4 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 5 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 6 }, this.pieces, [], false),
      new Pawn(false, { y: 1, x: 7 }, this.pieces, [], false)
    ];

    this.pieces[2] = Array(8).fill(null);
    this.pieces[3] = Array(8).fill(null);
    this.pieces[4] = Array(8).fill(null);
    this.pieces[5] = Array(8).fill(null);

    this.pieces[6] = [
      new Pawn(true, { y: 6, x: 0 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 1 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 2 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 3 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 4 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 5 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 6 }, this.pieces, [], false),
      new Pawn(true, { y: 6, x: 7 }, this.pieces, [], false)
    ];

    this.pieces[7] = [
      new Rook(true, { y: 7, x: 0 }, this.pieces, false),
      new Horse(true, { y: 7, x: 1 }, this.pieces, false),
      new Bishop(true, { y: 7, x: 2 }, this.pieces, false),
      new Queen(true, { y: 7, x: 3 }, this.pieces, false),
      new King(true, { y: 7, x: 4 }, this.pieces, false),
      new Bishop(true, { y: 7, x: 5 }, this.pieces, false),
      new Horse(true, { y: 7, x: 6 }, this.pieces, false),
      new Rook(true, { y: 7, x: 7 }, this.pieces, false)
    ];

    this.flattenPieces = [].concat.apply([], this.pieces).filter(p => p != null);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const matchId = +params.matchId;
      this.match$ = this.matchService.getMatch(matchId);
      this.match$.subscribe(match => {

        this.match = match;
        this.flippedBoard =
          this.userService.loggedUser !== match.whitePiecesUser.username;
        this.initPieces();
        this.matchService.getMoves(matchId).subscribe(moves => {
          this.moves = moves;
          const analysis = moves.map(m => m.analysis).filter(a => typeof a !== 'undefined' && a !== null);
          if (analysis && analysis.length > 0) {
            this.analysis = analysis;
            this.transformAnalysisData();
            this.analysis.unshift(analysesHead);
          }
          for (let i = 0; i < this.moves.length; i = i + 2) {
            this.acnMoves.push({
              white: this.moves[i].acn,
              black: (i + 1 < this.moves.length) ? moves[i + 1].acn : null
            });
          }
          this.analysisService.getOpenings(this.moves).subscribe(mops => {
            let i = 0;
            let currentMove = '';
            let currentOpening = '';
            for (const move of moves) {
              currentMove += ' ' + formatPosition(move.from) + formatPosition(move.to);
              if (i < mops.length && currentMove.trim() === mops[i].moves) {
                currentOpening = mops[i].openingName;
                i++;
              }
              this.openings.push(currentOpening);
            }
            this.openings.unshift('Starting position');
          });
        });
      });

    });
  }



  private undoMove(move: MoveDto): Piece[] {

    if (move.promotedTo) {
      const promotedPiece = this._promotedPieces.find(p => p.move === move);
      const newpiece = this.pieces[move.to.y][move.to.x];
      this.pieces[move.to.y][move.to.x] = promotedPiece.old;
      this._promotedPieces.splice(this._promotedPieces.indexOf(promotedPiece), 1);
      this.flattenPieces.splice(this.flattenPieces.indexOf(newpiece), 1);
      this.flattenPieces.push(promotedPiece.old);
    }

    const piece = this.pieces[move.to.y][move.to.x];
    const movedPieces = [piece];
    const secondPiece = this.pieces[move.from.y][move.from.x];


    if (secondPiece !== null) {
      if (secondPiece.isWhite === piece.isWhite) {
        movedPieces.push(secondPiece);
      }
    }
    let pieceToBeRestored = null;
    const index = this._droppedPieces.map(p => p.move).indexOf(move);
    if (index >= 0) {
      pieceToBeRestored = this._droppedPieces[index].piece;
      this.pieces[pieceToBeRestored.position.y][pieceToBeRestored.position.x] = pieceToBeRestored;
      this._droppedPieces.splice(index, 1);
      if (pieceToBeRestored.isWhite) {
        this.whiteDroppedPieces.splice(this.whiteDroppedPieces.indexOf(pieceToBeRestored, 1));
      } else {
        this.blackDroppedPieces.splice(this.whiteDroppedPieces.indexOf(pieceToBeRestored, 1));
      }
      this.flattenPieces.push(pieceToBeRestored);
    }
    piece.setPosition({ x: move.from.x, y: move.from.y });
    this.pieces[move.from.y][move.from.x] = piece;
    this.pieces[move.to.y][move.to.x] = pieceToBeRestored;
    const moveIdx = this.moves.indexOf(move);
    const moveClock = moveIdx > 0 ? this.moves[moveIdx - 1] : null;

    if (piece instanceof King) {
      const deltaX = move.to.x - move.from.x;
      if (Math.abs(deltaX) === 2) {
        const rookX = deltaX < 0 ? 0 : 7;
        const newRookX = move.to.x - deltaX / Math.abs(deltaX);
        this.pieces[move.from.y][rookX] = this.pieces[move.from.y][newRookX];
        this.pieces[move.from.y][newRookX] = null;
        this.pieces[move.from.y][rookX].setPosition({ x: rookX, y: move.from.y });
      }
    }



    this.setClock(moveClock, piece.isWhite);
    this.updateMarkers(this.moves.indexOf(move) - 1);
    return movedPieces;
  }

  private move(move: MoveDto): Piece[] {
    const piece = this.pieces[move.from.y][move.from.x];

    const movedPieces = [piece];
    let secondPiece = this.pieces[move.to.y][move.to.x];

    if (piece instanceof Pawn && move.acn.includes('x')) {
      const deltaY = move.to.y - move.from.y;
      const deltaX = move.to.x - move.from.x;
      if (Math.abs(deltaY) === 2 && Math.abs(deltaX) === 1) {
        secondPiece = this.pieces[move.from.y + deltaY / Math.abs(deltaY)][move.to.x];
      }
    }

    if (secondPiece !== null) {
      if (secondPiece.isWhite === piece.isWhite) {
        movedPieces.push(secondPiece);
      } else {
        this._droppedPieces.push({ move, piece: secondPiece });
        this.flattenPieces.splice(this.flattenPieces.indexOf(secondPiece), 1);
        if (secondPiece.isWhite) {
          this.whiteDroppedPieces.push(secondPiece);
        } else {
          this.blackDroppedPieces.push(secondPiece);
        }
      }
    }
    piece.setPosition({ x: move.to.x, y: move.to.y });
    this.pieces[move.to.y][move.to.x] = piece;
    this.pieces[move.from.y][move.from.x] = null;

    if (piece instanceof King) {
      const deltaX = move.to.x - move.from.x;
      if (Math.abs(deltaX) === 2) {
        const rookX = deltaX < 0 ? 0 : 7;
        const newRookX = move.to.x - deltaX / Math.abs(deltaX);
        this.pieces[move.from.y][newRookX] = this.pieces[move.from.y][rookX];
        this.pieces[move.from.y][rookX] = this.pieces[move.from.y][newRookX];
        this.pieces[move.from.y][newRookX].setPosition({ x: newRookX, y: move.from.y });
      }
    }
    if (move.promotedTo) {
      this._promotedPieces.push({ move, old: piece, new: this.promote(piece, move.promotedTo) });
      this._promotionPendingdPieces.push({ old: piece, new: this.promote(piece, move.promotedTo) });
    }
    this.setClock(move, piece.isWhite);
    this.updateMarkers(this.moves.indexOf(move));
    return movedPieces;
  }

  promote(piece: Piece, promotedTo: string): Piece {
    let newPiece;

    switch (promotedTo) {
      case pieceType.QUEEN:
        newPiece = new Queen(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          false
        );
        break;
      case pieceType.BISHOP:
        newPiece = new Bishop(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          false
        );
        break;
      case pieceType.HORSE:
        newPiece = new Horse(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          false
        );
        break;
      case pieceType.ROOK:
        newPiece = new Rook(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          false
        );
        break;
    }
    return newPiece;
  }

  private setClock(move: MoveDto, whiteTurn: boolean): void {
    if (move) {
      const activeClock = whiteTurn ? this.chessBoard.whitesPanel.clock : this.chessBoard.blacksPanel.clock;
      const inactiveClock = whiteTurn ? this.chessBoard.blacksPanel.clock : this.chessBoard.whitesPanel.clock;
      activeClock.setRemainingTime(move.timeInMillis);
      activeClock.state = 'stopped';
      inactiveClock.state = 'running';
    } else {
      this.chessBoard.whitesPanel.clock.state = 'running';
      this.chessBoard.blacksPanel.clock.state = 'stopped';
      this.chessBoard.whitesPanel.clock.setRemainingTime(this.match.timeInSeconds * 1000);
      this.chessBoard.blacksPanel.clock.setRemainingTime(this.match.timeInSeconds * 1000);
    }

  }

  skipBack() {
    this.stop();
    this.goTo(-1);
  }

  skipForward() {
    this.stop();
    this.goTo(this.moves.length);
  }

  stepBack() {
    this.stop();
    if (this._currentMove > 0) {
      const movedPieces = this.undoMove(this.moves[this._currentMove - 1]);
      for (const piece of movedPieces) {
        piece.animationState = 'moved';
      }
      this._currentMove--;
    }
  }
  stepForward() {
    this.stop();
    if (this._currentMove < this.moves.length) {
      const movedPieces = this.move(this.moves[this._currentMove]);
      for (const piece of movedPieces) {
        piece.animationState = 'moved';
      }
      this.soundService.doMoveSound(this.moves[this._currentMove].acn);
      this._currentMove++;
    }
  }

  onAnimationEnd(piece: Piece): void {
    piece.animationState = 'moving';
    const promotion = this._promotionPendingdPieces.find(p => p.old === piece);
    if (promotion) {
      this.flattenPieces.splice(this.flattenPieces.indexOf(piece), 1);
      this.pieces[piece.getPosition().y][piece.getPosition().x] = promotion.new;
      this.flattenPieces.push(promotion.new);
      this._promotionPendingdPieces.splice(this._promotionPendingdPieces.indexOf(promotion), 1);
    }
  }

  play() {
    this.playing = true;
    this.timerSusc = timer(1000, 1000).subscribe(t => {
      this.stepForward();
      if (this._currentMove >= this.moves.length) {
        this.timerSusc.unsubscribe();
        this.playing = false;
      }
    });
  }

  stop() {
    if (this.timerSusc) {
      this.timerSusc.unsubscribe();
    }
    this.playing = false;
  }
  goTo(position: number): void {
    if (position + 1 !== this._currentMove) {
      let posToMove = Math.min(position, this.moves.length - 1) - this._currentMove + 1;
      while (posToMove !== 0) {
        if (posToMove > 0) {
          const piecesMoved = this.move(this.moves[this._currentMove]);
          piecesMoved.forEach(p => this.onAnimationEnd(p));
          this._currentMove++;
          posToMove--;
        } else {
          const piecesMoved = this.undoMove(this.moves[this._currentMove - 1]);
          piecesMoved.forEach(p => this.onAnimationEnd(p));
          this._currentMove--;
          posToMove++;
        }
      }
    }
  }

  private updateMarkers(moveNumber: number) {
    if (moveNumber > 0) {
      this.fromMarkers = [this.moves[moveNumber].from, this.moves[moveNumber - 1].from];
      this.toMarkers = [this.moves[moveNumber].to, this.moves[moveNumber - 1].to];
    } else if (moveNumber === 0) {
      this.fromMarkers = [this.moves[moveNumber].from];
      this.toMarkers = [this.moves[moveNumber].to];
    } else {
      this.fromMarkers = [];
      this.toMarkers = [];
    }

  }

  protected onAnalyse() {
    this.analysisRequested = true;
    this.analysisService.getAnalysis(this.match.matchId).subscribe(
      analysis => {

        this.analysis = analysis;
        this.transformAnalysisData();
        this.analysis.unshift(analysesHead);
        this.analysisRequested = false;
      }
    );
  }

  private transformAnalysisData() {
    const playedAsWhite = this.userService.loggedUser === this.match.whitePiecesUser.username;
    if (!playedAsWhite) {
      this.analysis.forEach(a => {
        if (a.mateInX) {
          a.mateInX = -a.mateInX;
        }
        if (a.score) {
          a.score = -a.score;
        }
      });
    }
  }
}
