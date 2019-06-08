import { Piece, pieceType, Position, MoveResult } from './piece';


export class Horse extends Piece {

  constructor( isWhite: boolean, position: Position, pieces: Piece[][], isDraggable: boolean) {
    super(isWhite,pieceType.HORSE, position, pieces, isDraggable);
  }

  public getType(): string {
    return pieceType.HORSE;
  }

  protected pieceCanBeMovedTo(position: Position): MoveResult {

    const deltaX = Math.abs(this.getInitialPosition().x - position.x);
    const deltaY = Math.abs(this.getInitialPosition().y - position.y);

    if (!((deltaX === 2 && deltaY === 1) || (deltaX === 1 && deltaY === 2))) {
      return {isValid: false};
    }

    const overlappingPiece = this.getPiece(position);

    if (overlappingPiece != null && overlappingPiece.isWhite === this.isWhite) {
      return {isValid: false};
    }

    return {isValid: true , pieceToRemove: overlappingPiece};
  }

  public hasMoves(): boolean {
    const position = this.getPosition();
    for ( const i of [-2, 2, 1 , -1]) {
      for ( const j of [-2, 2, 1 , -1]) {
        if (this.positionIsValidAndEmpty({x: position.x + i, y: position.y + j})
        || this.existsPieceOfOppositeColor({x: position.x + i, y: position.y + j})) {
          return true;
        }
      }
    }
    return false;
  }

  protected getAvailableAbsolutePositions(): Position[] {

    let availableMoves = [];
    for (const i of [2 , 1 , -1 , -2]) {
      for (const j of [2 , 1 , -1 , -2]) {
        if ( Math.abs (i * j) === 2 ) {
        availableMoves = availableMoves.concat(this.getPositionsUntilCollision(i, j , true));
      }
      }
    }
    return availableMoves;
  }

}
