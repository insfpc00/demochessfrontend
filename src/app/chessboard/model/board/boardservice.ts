import { Piece, Position, pieceType } from '../piece';
import { Move, MoveDto } from '../move';
import { King } from '../king';
import { Pawn } from '../pawn';
import { Bishop } from '../bishop';
import { Rook } from '../rook';
import { Horse } from '../horse';
import { Queen } from '../queen';
import { PromotionDialogComponent } from 'src/app/board/promotiondialog/promotiondialog.component';
import { Injectable, EventEmitter } from '@angular/core';
import { SoundService } from 'src/app/core/sound.service';
import { MatDialog } from '@angular/material';

export interface Promotion {
  promotedPiece: Piece;
  newType: string;
}
export const matchResultTypes = { checkmate: 'CHECKMATE', stalemate: 'STALEMATE' };


@Injectable()
export class BoardService {

  pieces: Piece[][] = new Array();
  flattenPieces: Piece[];
  whiteDroppedPieces: Piece[] = new Array();
  blackDroppedPieces: Piece[] = new Array();
  moves: Move[] = new Array();
  iamWhitePieces: boolean;
  isMyTurn = false;
  private blackKing: King;
  private whiteKing: King;
  private numberOfMoves = 0;
  toMarkers: Position[] = new Array();
  fromMarkers: Position[] = new Array();
  movesInACN = [];
  toBePromoted: Promotion;
  turnChange: EventEmitter<boolean> = new EventEmitter();
  private _lastPromotedPiece: Piece;
  private _lastDroppedPiece: Piece;

  constructor(private soundService: SoundService, private matDialog: MatDialog) {
  }

  public initPieces(): void {
    this.pieces[0] = [
      new Rook(false, { y: 0, x: 0 }, this.pieces, !this.iamWhitePieces),
      new Horse(false, { y: 0, x: 1 }, this.pieces, !this.iamWhitePieces),
      new Bishop(false, { y: 0, x: 2 }, this.pieces, !this.iamWhitePieces),
      new Queen(false, { y: 0, x: 3 }, this.pieces, !this.iamWhitePieces),
      (this.blackKing = new King(
        false,
        { y: 0, x: 4 },
        this.pieces,
        !this.iamWhitePieces)),
      new Bishop(false, { y: 0, x: 5 }, this.pieces, !this.iamWhitePieces),
      new Horse(false, { y: 0, x: 6 }, this.pieces, !this.iamWhitePieces),
      new Rook(false, { y: 0, x: 7 }, this.pieces, !this.iamWhitePieces)
    ];

    this.pieces[1] = [
      new Pawn(
        false,
        { y: 1, x: 0 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 1 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 2 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 3 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 4 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 5 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 6 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      ),
      new Pawn(
        false,
        { y: 1, x: 7 },
        this.pieces,
        this.moves,
        !this.iamWhitePieces
      )
    ];

    this.pieces[6] = [
      new Pawn(
        true,
        { y: 6, x: 0 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 1 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 2 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 3 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 4 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 5 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(
        true,
        { y: 6, x: 6 },
        this.pieces,
        this.moves,
        this.iamWhitePieces
      ),
      new Pawn(true, { y: 6, x: 7 }, this.pieces, this.moves, this.iamWhitePieces)
    ];

    this.pieces[7] = [
      new Rook(true, { y: 7, x: 0 }, this.pieces, this.iamWhitePieces),
      new Horse(true, { y: 7, x: 1 }, this.pieces, this.iamWhitePieces),
      new Bishop(true, { y: 7, x: 2 }, this.pieces, this.iamWhitePieces),
      new Queen(true, { y: 7, x: 3 }, this.pieces, this.iamWhitePieces),
      (this.whiteKing = new King(
        true,
        { y: 7, x: 4 },
        this.pieces,
        this.iamWhitePieces
      )),
      new Bishop(true, { y: 7, x: 5 }, this.pieces, this.iamWhitePieces),
      new Horse(true, { y: 7, x: 6 }, this.pieces, this.iamWhitePieces),
      new Rook(true, { y: 7, x: 7 }, this.pieces, this.iamWhitePieces)
    ];

    this.pieces[2] = Array(8).fill(null);
    this.pieces[3] = Array(8).fill(null);
    this.pieces[4] = Array(8).fill(null);
    this.pieces[5] = Array(8).fill(null);
    this.flattenPieces = [].concat.apply([], this.pieces).filter(p => p != null);
    this.flattenPieces = this.iamWhitePieces ? this.flattenPieces.reverse() : this.flattenPieces;
    // this.markers = new Array();
    this.setTurn(true);
  }
  private removePiece(piece: Piece): void {

    if (piece.isWhite) {
      this.whiteDroppedPieces.push(piece);
    } else {
      this.blackDroppedPieces.push(piece);
    }
    this.pieces[piece.getPosition().y][piece.getPosition().x] = null;

    this.flattenPieces.splice(this.flattenPieces.indexOf(piece), 1);
  }

  private undoRemovePiece(piece: Piece) {
    if (piece.isWhite) {
      this.whiteDroppedPieces.pop();
    } else {
      this.blackDroppedPieces.pop();
    }
    this.pieces[piece.getPosition().y][piece.getPosition().x] = piece;
    this.flattenPieces.push(piece);
  }

  private relocatePiece(piece: Piece): void {
    this.pieces[piece.getInitialPosition().y][
      piece.getInitialPosition().x
    ] = null;
    this.pieces[piece.getPosition().y][piece.getPosition().x] = piece;
    piece.setInitialPosition(piece.getPosition());
    piece.moved = true;
  }

  private movePiece(
    piece: Piece,
    removedPiece: Piece,
    promotedType: string, matchResult?: string
  ): Move {
    const move = new Move(
      this.numberOfMoves++,
      piece,
      Object.assign({}, piece.getInitialPosition()),
      Object.assign({}, piece.getPosition()),
    );

    this.moves.unshift(move);
    if (this.moves.length > 3) {
      this.moves.pop();
    }

    if (removedPiece !== null) {
      this.removePiece(removedPiece);
    }

    if (promotedType) {
      move.promotedTo = promotedType;
      this.promotePiece(piece, promotedType);
    } else {
      this.relocatePiece(piece);
    }

    const king = piece.isWhite ? this.whiteKing : this.blackKing;
    if (king.isBeingChecked()) {
      piece.setPosition(move.from);
      piece.setInitialPosition(move.to);
      this.relocatePiece(piece);
      if (removedPiece !== null) {
        this.undoRemovePiece(removedPiece);
      }
      return;
    }
    this.toggleAnimationState(move);
    this._lastDroppedPiece = removedPiece;
    return move;
  }
  private updateMarkers() {

    if (this.moves.length >= 1) {
      this.fromMarkers.unshift(this.moves[0].from);
      this.toMarkers.unshift(this.moves[0].to);
      if (this.fromMarkers.length > 2) {
        this.fromMarkers.pop();
        this.toMarkers.pop();
      }
    }
  }

  public async tryToMovePiece(piece: Piece, callBackfn: (move: Move) => void) {
    if (piece.getPosition().x === piece.getInitialPosition().x &&
      piece.getPosition().y === piece.getInitialPosition().y) {
      // || !this.matchReady && this.isMyTurn
      // || this.userDisconnected) {
      piece.cancelDrag();
    }

    const moveResult = piece.canBeMovedTo(piece.getPosition());

    let promotedType;

    if (piece instanceof Pawn &&
      piece.isWhite === this.iamWhitePieces &&
      piece.getPosition().y === (piece.isWhite ? 0 : 7)) {
      await this.openPromotionDialog(piece).then(
        newType => promotedType = newType
      );
    }

    if (moveResult.pieceToRelocate) {
      this.relocatePiece(moveResult.pieceToRelocate);
    }
    if (moveResult.isValid) {

      // this.drawOffered = false;
      // this.offeringDraw = false;
      const move = this.movePiece(
        piece,
        moveResult.pieceToRemove ? moveResult.pieceToRemove : null,
        promotedType
      );

      if (move) {
        const matchResult = this.matchStateAfterMove();
        this.updateMarkers();
        if (!move.promotedTo){
          this._lastPromotedPiece = null; }

        move.acn = this.convertToACNFormat(move,
          move.piece.isWhite ? this.blackKing.isBeingChecked() : this.whiteKing.isBeingChecked(),
          matchResult ? matchResult === matchResultTypes.checkmate : false,
          moveResult.pieceToRemove ? true : false);
        this.updateACNMovesList(move.acn, move.piece.isWhite);
        if (piece.isWhite === this.iamWhitePieces) {
          if (callBackfn) {
            callBackfn(move);
          }
        }
        this.soundService.doMoveSound(move.acn);
        this.setTurn(!move.piece.isWhite);
      }
    } else {
      piece.cancelDrag();
    }
  }

  async openPromotionDialog(piece: Piece): Promise<string> {

    const dialogRef = this.matDialog.open(PromotionDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'promotion-dialog',
      position: {
        top: piece.draggingStartPosition.y + 'px',
        left: piece.draggingStartPosition.x + 'px'
      },
      data: { pieceType: '', isWhite: piece.isWhite }
    });
    let newType;

    await dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        newType = result.pieceType;
      });

    return newType;
  }
  private updateACNMovesList(acnMove: string, createNew: boolean) {
    if (createNew) {
      this.movesInACN.unshift(acnMove);
    } else {
      this.movesInACN[0] += ' ' + acnMove;
    }
  }

  matchStateAfterMove(): string {
    const checkWhite = !(
      (this.isMyTurn && this.iamWhitePieces) ||
      (!this.isMyTurn && !this.iamWhitePieces)
    );
    const king = checkWhite ? this.whiteKing : this.blackKing;

    if (king.isCheckMated()) {
      return this.isMyTurn ? matchResultTypes.checkmate : '';
    } else if (king.isStaleMated()) {
      return matchResultTypes.stalemate;
    }
  }

  private convertToACNFormat(move: Move, isCheck: boolean, isCheckMate: boolean, pieceCaptured: boolean): string {
    const piecesShort = { PAWN: '', BISHOP: 'B', HORSE: 'N', QUEEN: 'Q', ROOK: 'R', KING: 'K' };
    const formatPosition = (p: Position) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][p.x] + (7 - p.y + 1);
    const from = formatPosition(move.from);
    const to = formatPosition(move.to);
    const piece = piecesShort[move.piece.type];
    if (move.piece instanceof King) {
      const deltaX = move.to.x - move.from.x;
      if (Math.abs(deltaX) === 2) {
        return deltaX === 2 ? 'O-O' : 'O-O-O';
      }
    }
    return piece + from + (pieceCaptured ? 'x' : '-')
      + to
      + (isCheck ? (isCheckMate ? '#' : '+') : '')
      + (move.promotedTo ? '=' + piecesShort[move.promotedTo] : '');
  }

  toggleAnimationState(move: Move) {
    const piece = this.pieces[move.to.y][move.to.x];
    if (piece.isWhite === this.iamWhitePieces) {
      if (this.moves.length >= 2) {
        (this.moves[1].piece as Piece).animationState = 'moving';
      }
    } else {
      piece.animationState = 'moved';
    }

  }
  public setTurn(isWhiteTurn: boolean) {
    this.isMyTurn =
      (isWhiteTurn && this.iamWhitePieces) ||
      (!isWhiteTurn && !this.iamWhitePieces);
    this.turnChange.emit(isWhiteTurn);
  }

  promotePiece(piece: Piece, newType: string): void {
    let newPiece;
    const isDraggable = (piece.isWhite && this.iamWhitePieces) || (!piece.isWhite && !this.iamWhitePieces);

    switch (newType) {
      case pieceType.QUEEN:
        newPiece = new Queen(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          isDraggable
        );
        break;
      case pieceType.BISHOP:
        newPiece = new Bishop(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          isDraggable
        );
        break;
      case pieceType.HORSE:
        newPiece = new Horse(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          isDraggable
        );
        break;
      case pieceType.ROOK:
        newPiece = new Rook(
          piece.isWhite,
          piece.getPosition(),
          this.pieces,
          isDraggable
        );
        break;
    }
    this.pieces[piece.getInitialPosition().y][piece.getInitialPosition().x] = null;
    this.pieces[piece.getPosition().y][piece.getPosition().x] = newPiece;
    this._lastPromotedPiece = this.flattenPieces.splice(this.flattenPieces.indexOf(piece), 1)[0];
    this.flattenPieces.push(newPiece);

  }
  onAnimationEnd(piece: Piece): void {
    if (this.toBePromoted && piece === this.toBePromoted.promotedPiece) {
      this.promotePiece(piece, this.toBePromoted.newType);
      this.toBePromoted = null;
    }
  }

  public loadFromFen(fen: string, firstToMove: boolean) {
    let rows = fen.split(' ')[0].split('/').map(r => r.split(''));

    const fenInfo = fen.split(' ')[1].trim();
    const whiteToMove = fenInfo.startsWith('w');
    rows = rows.map(r => r.flatMap(v => !Number.isNaN(Number(v)) ? new Array(parseInt(v)).fill(null) : [v] ));
    this.iamWhitePieces = !firstToMove && !whiteToMove || firstToMove && whiteToMove;
    this.pieces = rows.map((r, y) => r.map((r2, x) => (r2 !== null) ? this.createPiece(x, y, r2, this.iamWhitePieces) : null));

    this.flattenPieces = [].concat.apply([], this.pieces).filter(p => p != null);
    this.flattenPieces = this.iamWhitePieces ? this.flattenPieces.reverse() : this.flattenPieces;
    this.flattenPieces.forEach(p => p.pieces = this.pieces);
    this.whiteKing = this.flattenPieces.find(p => p.isWhite && p instanceof King) as King;
    this.blackKing = this.flattenPieces.find(p => !p.isWhite && p instanceof King) as King;

    this.setTurn(whiteToMove);

  }

  private createPiece(x: number, y: number, c: string, iamWhitePieces: boolean) {
    let piece: Piece = null;
    const isWhite = c.toUpperCase() === c;
    const isDraggable = iamWhitePieces === isWhite;
    switch (c.toLowerCase()) {
      case 'p':
        piece = new Pawn(isWhite, { x, y }, this.pieces, this.moves, isDraggable);
        break;
      case 'n':
        piece = new Horse(isWhite, { x, y }, this.pieces, isDraggable);
        break;
      case 'r':
        piece = new Rook(isWhite, { x, y }, this.pieces, isDraggable);
        break;
      case 'q':
        piece = new Queen(isWhite, { x, y }, this.pieces, isDraggable);
        break;
      case 'k':
        piece = new King(isWhite, { x, y }, this.pieces, isDraggable);
        break;
      case 'b':
        piece = new Bishop(isWhite, { x, y }, this.pieces, isDraggable);
        break;
    }
    return piece;
  }

  public doMove(move: MoveDto) {
    const piece = this.pieces[move.from.y][move.from.x];
    if (move.promotedTo) {
      this.toBePromoted = {
        promotedPiece: piece,
        newType: move.promotedTo
      };
    }
    piece.setPosition(move.to);
    this.tryToMovePiece(piece, (m: Move) => { });
  }

  public undoLastMove(): Piece[] {
    const move = this.moves.shift();
    if (move.promotedTo) {

      const newpiece = this.pieces[move.to.y][move.to.x];
      this.pieces[move.to.y][move.to.x] = this._lastPromotedPiece;
      this.flattenPieces.splice(this.flattenPieces.indexOf(newpiece), 1);
      this.flattenPieces.push(this._lastPromotedPiece);
    }

    const piece = this.pieces[move.to.y][move.to.x];
    const movedPieces = [piece];
    const secondPiece = this.pieces[move.from.y][move.from.x];

    if (secondPiece !== null) {
      if (secondPiece.isWhite === piece.isWhite) {
        movedPieces.push(secondPiece);
      }
    }
    if (this._lastDroppedPiece !== null) {
      this.pieces[this._lastDroppedPiece.getPosition().y][this._lastDroppedPiece.getPosition().x] = this._lastDroppedPiece;
      if (this._lastDroppedPiece.isWhite) {
        this.whiteDroppedPieces.splice(this.whiteDroppedPieces.indexOf(this._lastDroppedPiece, 1));
      } else {
        this.blackDroppedPieces.splice(this.whiteDroppedPieces.indexOf(this._lastDroppedPiece, 1));
      }
      this.flattenPieces.push(this._lastDroppedPiece);
    }
    piece.setPosition({ x: move.from.x, y: move.from.y });
    piece.setInitialPosition({ x: move.from.x, y: move.from.y });
    this.pieces[move.from.y][move.from.x] = piece;
    this.pieces[move.to.y][move.to.x] = this._lastDroppedPiece;

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
    this.setTurn(piece.isWhite);
    this.soundService.doErrorSound();
    return movedPieces;
  }
}
