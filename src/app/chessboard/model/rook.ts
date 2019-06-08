import {Piece, pieceType, Position, MoveResult } from './piece';

export class Rook extends Piece {

  constructor( isWhite: boolean,  position: Position, pieces: Piece[][], isDraggable: boolean) {
    super(isWhite, pieceType.ROOK, position, pieces, isDraggable);
  }

  public getType(): string {
    return pieceType.ROOK;
  }

  protected pieceCanBeMovedTo(position: Position): MoveResult {

    const deltaX = Math.abs(this.getInitialPosition().x - position.x);
    const deltaY = Math.abs(this.getInitialPosition().y - position.y);

    if (deltaX !== 0 && deltaY === 0 || deltaY !== 0 && deltaX === 0) {
      const overlappingPiece = this.getPiece(position);

      if (this.hasColissions(this.getInitialPosition(), position) ||
        (overlappingPiece != null && overlappingPiece.isWhite === this.isWhite)) {
      return {isValid: false};
      }
      return {isValid: true, pieceToRemove: overlappingPiece};
    }

    return {isValid: false, pieceToRemove: null};
  }

  public hasMoves(): boolean {
    const position = this.getPosition();
    return (
      this.positionIsValidAndEmpty({x: position.x + 1, y: position.y}) ||
      this.positionIsValidAndEmpty({x: position.x - 1, y: position.y}) ||
      this.positionIsValidAndEmpty({x: position.x, y: position.y + 1}) ||
      this.positionIsValidAndEmpty({x: position.x, y: position.y - 1}) ||
      this.existsPieceOfOppositeColor({x: position.x + 1, y: position.y}) ||
      this.existsPieceOfOppositeColor({x: position.x - 1, y: position.y}) ||
      this.existsPieceOfOppositeColor({x: position.x, y: position.y + 1}) ||
      this.existsPieceOfOppositeColor({x: position.x, y: position.y - 1}));
  }

  protected getAvailableAbsolutePositions(): Position[] {

    let availableMoves = [];
    for (const i of [-1 , 1]) {
        availableMoves = availableMoves.concat(this.getPositionsUntilCollision(i, 0 , false));
        availableMoves = availableMoves.concat(this.getPositionsUntilCollision(0, i , false));
    }
    return availableMoves;
  }
}
