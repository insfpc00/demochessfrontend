import { Piece, pieceType, Position, MoveResult } from './piece';
import {Move} from './move';

export class Pawn extends Piece {
  private moves: Move[];

  constructor( isWhite: boolean, position: Position, pieces: Piece[][], moves: Move[], isDraggable: boolean) {
    super(isWhite,pieceType.PAWN, position,  pieces, isDraggable);
    this.moves = moves;
  }

  public getType(): string {
    return pieceType.PAWN;
  }

  protected pieceCanBeMovedTo(position: Position): MoveResult {
    const direction = this.isWhite ? 1 : -1;
    const deltaX = Math.abs(this.getInitialPosition().x - position.x);
    const deltaY = this.getInitialPosition().y - position.y;

    const overlappingPiece = this.getPiece(position);

    if (deltaY * direction === 1 && deltaX === 1 && overlappingPiece == null) {
      const expectedPawn = this.getPiece({
        x: position.x,
        y: position.y + direction
      });

      if (expectedPawn !== null &&
        expectedPawn.getType() === pieceType.PAWN &&
        expectedPawn.isWhite !== this.isWhite &&
        expectedPawn === this.moves[0].piece &&
        Math.abs(this.moves[0].to.y - this.moves[0].from.y) === 2) {
        return { isValid: true, pieceToRemove: expectedPawn };
      } else {
        return { isValid: false };
      }
    }

    if (deltaY === 0 ||
      deltaX > 1 ||
      deltaY * direction > 2 ||
      deltaY * direction <= 0 ||
      (deltaX === 1 && deltaY * direction === 2) ||
      (deltaY * direction === 2 &&
        this.getInitialPosition().y !== 3.5 + 2.5 * direction) ||
      (deltaX === 1 && overlappingPiece === null) ||
      (overlappingPiece != null && overlappingPiece.isWhite === this.isWhite) ||
      (overlappingPiece != null &&
        overlappingPiece.isWhite !== this.isWhite &&
        deltaX !== 1)) {
      return { isValid: false };
    }

    /* if (
      pawn.isWhite === this.iamWhitePieces &&
      pawn.getPosition().y === (pawn.isWhite ? 0 : 7)
    ) {
      this.openPromotionDialog(pawn);
    } */
    return { isValid: true, pieceToRemove: deltaX === 1 ? this.getPiece(position) : null};

  }

  public hasMoves(): boolean {
    const direction = this.isWhite ? -1 : 1;
    const position = this.getPosition();
    return (
      this.getPiece({x: position.x, y: position.y + direction}) === null
      || ((this.getPiece({x: position.x + 1, y: position.y + direction}) !== null
      || this.getPiece({x: position.x - 1, y: position.y + direction}) !== null)
          && this.getPiece( {x: position.x, y: position.y + direction}) !== null
          && this.getPiece( {x: position.x, y: position.y + direction}).isWhite !== this.isWhite));
  }

  public getAvailableAbsolutePositions(): Position[] {

    const availableMoves = [];
    const direction = this.isWhite ? -1 : 1;
    if (this.canBeMovedTo( { x: this.getPosition().x, y: this.getPosition().y + direction } ).isValid) {
      availableMoves.push({ x: this.getPosition().x, y: this.getPosition().y + direction });
    }

    if (this.canBeMovedTo( { x: this.getPosition().x, y: this.getPosition().y + 2 * direction } ).isValid) {
      availableMoves.push({ x: this.getPosition().x, y: this.getPosition().y + 2 * direction });
    }

    if (this.canBeMovedTo( { x: this.getPosition().x + 1, y: this.getPosition().y + direction } ).isValid) {
      availableMoves.push({ x: this.getPosition().x + 1, y: this.getPosition().y +  direction });
    }

    if (this.canBeMovedTo( { x: this.getPosition().x - 1, y: this.getPosition().y + direction } ).isValid) {
      availableMoves.push({ x: this.getPosition().x - 1, y: this.getPosition().y +  direction });
    }

    return availableMoves;
}

}
