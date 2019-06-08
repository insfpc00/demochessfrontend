import {Piece, pieceType, Position, MoveResult } from './piece';

export class Queen extends Piece {

  constructor( isWhite: boolean, position: Position, pieces: Piece[][], isDraggable: boolean) {
    super(isWhite,pieceType.QUEEN, position,  pieces, isDraggable);
  }

  public getType(): string {
    return pieceType.QUEEN;
  }


  protected pieceCanBeMovedTo(position: Position): MoveResult {
      const deltaX = Math.abs(this.getInitialPosition().x - position.x);
      const deltaY = Math.abs(this.getInitialPosition().y - position.y);

      if (!((deltaX > 0 && deltaY > 0 && deltaX === deltaY) ||
          (deltaX > 0 && deltaY === 0) || (deltaY > 0 && deltaX === 0))) {
        return {isValid: false};
      }
      const overlappingPiece = this.getPiece(position);
      if (this.hasColissions(this.getInitialPosition(), position) ||
        (overlappingPiece != null && overlappingPiece.isWhite === this.isWhite)) {
        return {isValid: false};
      }
      return {isValid: true, pieceToRemove: overlappingPiece};
    }

    public hasMoves(): boolean {
      const position = this.getPosition();
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 && j !== 0){
            const positionToCheck = { x: position.x + i, y: position.y + j };
            if (this.positionIsValidAndEmpty(positionToCheck) || this.existsPieceOfOppositeColor(positionToCheck)) {
              return true;
            }
          }
        }
      }
      return false;
    }

  protected getAvailableAbsolutePositions(): Position[] {

      let availableMoves = [];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
              availableMoves = availableMoves.concat(this.getPositionsUntilCollision(i, j , false));
            }
        }
      }
      return availableMoves;
  }
}
