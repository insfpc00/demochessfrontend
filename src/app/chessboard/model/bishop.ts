import {Piece, pieceType, Position, MoveResult } from './piece';

export class Bishop extends Piece {

  constructor( isWhite: boolean, position: Position,  pieces: Piece[][], isDraggable: boolean) {
    super(isWhite, pieceType.BISHOP, position, pieces, isDraggable);
  }

  public getType(): string{
    return pieceType.BISHOP;
  }
  protected pieceCanBeMovedTo(position: Position): MoveResult {

    const deltaX = Math.abs(this.getInitialPosition().x - this.getPosition().x);
    const deltaY = Math.abs(this.getInitialPosition().y - this.getPosition().y);

    if (deltaX !== deltaY) {
      return {isValid: false};
    }
    const overlappingPiece = this.getPiece(this.getPosition());
    if (this.hasColissions(this.getInitialPosition(), this.getPosition()) ||
      (overlappingPiece != null && overlappingPiece.isWhite === this.isWhite)) {
      return {isValid : false};
    }
    return {isValid: true, pieceToRemove: overlappingPiece};
  }

  public hasMoves(): boolean {
    const position = this.getPosition();
    return (
      this.positionIsValidAndEmpty({x: position.x + 1, y: position.y + 1 }) ||
      this.positionIsValidAndEmpty({x: position.x - 1, y: position.y - 1}) ||
      this.positionIsValidAndEmpty({x: position.x + 1, y: position.y - 1}) ||
      this.positionIsValidAndEmpty({x: position.x - 1, y: position.y + 1}) ||
      this.existsPieceOfOppositeColor({x: position.x + 1, y: position.y + 1}) ||
      this.existsPieceOfOppositeColor({x: position.x - 1, y: position.y - 1}) ||
      this.existsPieceOfOppositeColor({x: position.x + 1, y: position.y - 1}) ||
      this.existsPieceOfOppositeColor({x: position.x - 1, y: position.y + 1}));
  }

  protected getAvailableAbsolutePositions(): Position[] {

    let availableMoves = [];
    for (const i of [-1 , 1]) {
      for (const j of [-1 , 1]) {
        availableMoves = availableMoves.concat(this.getPositionsUntilCollision(i, j , false));
      }
    }
    return availableMoves;
  }
}
