import { SimplePiece } from './simplepiece';

export interface Position {
  x: number;
  y: number;
}
export interface MoveResult {
  isValid: boolean;
  pieceToRemove?: Piece;
  pieceToRelocate?: Piece;
}
export const pieceType = {
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  HORSE: 'HORSE',
  ROOK: 'ROOK',
  QUEEN: 'QUEEN',
  KING: 'KING'
};

export abstract class Piece extends SimplePiece{
  //isWhite: boolean;
  animationState = 'moving';
  position: Position;
  private initialPosition: Position;
  draggingStartPosition: Position;
  screen: Position;
  moved: boolean;
  beingDragged = false;
  isDraggable: boolean;
  pieces: Piece[][];

  get isWhite(){
    return this.color === 'WHITE';
  }

  public cancelDrag(): void {
    this.setPosition(this.getInitialPosition());
  }
  public fixPosition(): void {
    this.setPosition({ x: Math.round(this.position.x), y: Math.round(this.position.y) });
  }

  public getInitialPosition(): Position {
    return this.initialPosition;
  }

  public setPosition(position: Position): void {
    this.position = position;
  }

  public getPosition(): Position {
    return this.position;
  }

  /* public setFlippedPosition(position: Position): void {
    this.setPosition(this.flippPosition(position));
  } */

  public setInitialPosition(position: Position): void {
    this.initialPosition = Object.assign({}, position);
  }

  protected isBetweenBoundaries(position: Position) {
    return (
      position.x <= 7 && position.x >= 0 && position.y <= 7 && position.y >= 0
    );
  }

  protected getPiece(position: Position): Piece {
    if (!this.isBetweenBoundaries(position)) {
      return null;
    } else {
      return this.pieces[position.y][position.x];
    }
  }
  protected getAllPieces(): Piece[] {
    return [].concat.apply([], this.pieces);
  }

  protected getFirstCollision(
    position: Position,
    incX: number,
    incY: number,
    stopOnFirst: boolean
  ): Piece {
    const myPosition = Object.assign({}, position);
    myPosition.x += incX;
    myPosition.y += incY;
    while (this.isBetweenBoundaries(myPosition)) {
      const piece = this.getPiece(myPosition);
      if (piece != null) {
        return piece;
      }
      myPosition.x += incX;
      myPosition.y += incY;

      if (stopOnFirst) {
        return null;
      }
    }
    return null;
  }

  protected positionInCheck(position: Position, isWhite: boolean): boolean {
    const inlineCheck = piece =>
      piece != null &&
      (piece.getType() === pieceType.QUEEN ||
        piece.getType() === pieceType.ROOK) &&
      piece.isWhite !== isWhite;

    const inlineIncs = [0, 1, -1];
    if (!inlineIncs.every(d => inlineIncs.filter(d2 => Math.abs(d2 + d) === 1 )
    .every(d2 => !inlineCheck(this.getFirstCollision(position, d, d2, false))))) {
      return true;
    }

    const diagonalCheck = piece =>
      piece != null &&
      (piece.getType() === pieceType.QUEEN ||
        piece.getType() === pieceType.BISHOP) &&
      piece.isWhite !== isWhite;

    const diagonalIncs = [1, -1];
    if (!diagonalIncs.every(d => diagonalIncs.every(d2 => !diagonalCheck(this.getFirstCollision(position, d, d2, false))))) {
      return true;
    }

    const horseCheck = piece =>
      piece != null &&
      piece.getType() === pieceType.HORSE &&
      piece.isWhite !== isWhite;

    const horseIncs = [-1, -2, 1, 2];
    if (!horseIncs.every(d => horseIncs.filter(d2 => Math.abs(d2) !== Math.abs(d))
    .every(d2 => !horseCheck(this.getFirstCollision(position, d, d2, true))))) {
      return true;
    }

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          position.x + i >= 0 &&
          position.x + i < 8 &&
          position.y + j >= 0 &&
          position.y + j < 8
        ) {
          if (i !== 0 || j !== 0) {
            const piece = this.getPiece({
              x: position.x + i,
              y: position.y + j
            });
            if (
              piece != null &&
              piece.getType() === pieceType.KING &&
              piece.isWhite !== isWhite
            ) {
              return true;
            }
          }
        }
      }
    }

    const direction = isWhite ? -1 : 1;
    for (let i = -1; i <= 1; i += 2) {
      if (position.x + i >= 0 && position.x + i < 8) {
        const piece = this.getPiece({
          x: position.x + i,
          y: position.y + direction
        });
        if (
          piece != null &&
          piece.getType() === pieceType.PAWN &&
          piece.isWhite !== isWhite
        ) {
          return true;
        }
      }
    }
    return false;
  }

  protected existsPieceOfOppositeColor(position: Position): boolean {
    const piece = this.getPiece(position);
    return piece != null && piece.isWhite !== this.isWhite;
  }
  public abstract hasMoves(): boolean;

  protected positionIsValidAndEmpty(position: Position): boolean {
    if (!this.isBetweenBoundaries(position)) {
      return false;
    } else {
      return this.getPiece(position) === null;
    }
  }

  protected hasColissions(from: Position, to: Position): boolean {
    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;
    const incX = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1;
    const incY = deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1;

    while (deltaX !== incX || deltaY !== incY) {
      deltaX -= incX;
      deltaY -= incY;
      if (this.getPiece({ x: to.x - deltaX, y: to.y - deltaY }) !== null) {
        return true;
      }
    }
    return false;
  }

  public getPositionsUntilCollision(
    incX: number,
    incY: number,
    stopOnFirst: boolean
  ) {
    const result: Position[] = [];
    const myPosition = Object.assign({}, this.initialPosition);
    myPosition.x += incX;
    myPosition.y += incY;
    while (this.isBetweenBoundaries(myPosition)) {
      const piece = this.getPiece(myPosition);
      if (piece != null) {
        if (piece.isWhite !== this.isWhite) {
          result.push(Object.assign({}, myPosition));
        }
        break;
      }
      result.push(Object.assign({}, myPosition));
      if (stopOnFirst) {
        break;
      }
      myPosition.x += incX;
      myPosition.y += incY;
    }
    return result;
  }
  public getAvailablePositions() {
  return this.getAvailableAbsolutePositions();
  }
  protected abstract getAvailableAbsolutePositions(): Position[];
  public canBeMovedTo(position: Position): MoveResult {
    if (!this.isBetweenBoundaries(position)) {
      return { isValid: false };
    } else {
      return this.pieceCanBeMovedTo(position);
    }
  }

  protected abstract pieceCanBeMovedTo(position: Position): MoveResult;


  constructor(
    isWhite: boolean,
    type: string,
    position: Position,
    pieces: Piece[][],
    isDraggable: boolean
  ) {
    super(isWhite ? 'WHITE' : 'BLACK', type);
    this.draggingStartPosition = { x: 0, y: 0 };
    this.moved = false;
    this.screen = { x: 0, y: 0 };

    this.setPosition(position);
    this.setInitialPosition(position);
    this.pieces = pieces;
    this.isDraggable = isDraggable;
  }
}
