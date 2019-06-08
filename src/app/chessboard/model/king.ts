import { Piece, pieceType, Position, MoveResult } from './piece';

export class King extends Piece {
  constructor(
    isWhite: boolean,
    position: Position,
    pieces: Piece[][],
    isDraggable: boolean
  ) {
    super(isWhite, pieceType.KING, position, pieces, isDraggable);
  }

  public getType(): string {
    return pieceType.KING;
  }

  protected pieceCanBeMovedTo(position: Position): MoveResult {
    const deltaX = this.getInitialPosition().x - position.x;
    const deltaY = Math.abs(this.getInitialPosition().y - position.y);
    const overlappingPiece = this.getPiece(position);

    if (Math.abs(deltaX) === 2 && deltaY === 0 ) {
      // trying to castle
      if (this.moved) {
        return { isValid: false };
      }
      const direction = -deltaX / Math.abs(deltaX);
      const myPosition = Object.assign({}, this.getInitialPosition());
      myPosition.x += direction;

      while (myPosition.x > 0 && myPosition.x < 7) {
        if (
          this.getPiece(myPosition) !== null ||
          this.positionInCheck(myPosition, this.isWhite)
        ) {
          return { isValid: false };
        }
        myPosition.x += direction;
      }

      const expectedRook = this.getPiece(myPosition);
      if (
        expectedRook == null ||
        expectedRook.moved ||
        expectedRook.isWhite !== this.isWhite
      ) {
        return { isValid: false };
      }
      expectedRook.setPosition({ x: position.x - direction, y: position.y });
      return { isValid: true, pieceToRelocate: expectedRook };
    } else {
      if (
        Math.abs(deltaX) > 1 ||
        deltaY > 1 ||
        (overlappingPiece != null &&
          overlappingPiece.isWhite === this.isWhite) ||
        this.positionInCheck(position, this.isWhite)
      ) {
        return { isValid: false };
      }
      return { isValid: true, pieceToRemove: overlappingPiece };
    }
  }

  public hasMoves(): boolean {
    const position = this.getPosition();

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const positionToCheck = { x: position.x + i, y: position.y + j };
        if (
          (this.positionIsValidAndEmpty(positionToCheck) ||
            this.existsPieceOfOppositeColor(positionToCheck)) &&
          !this.positionInCheck(
            { x: position.x + i, y: position.y + j },
            this.isWhite
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  public isCheckMated(): boolean {
    if (this.positionInCheck(this.getPosition(), this.isWhite) && !this.hasMoves()) {

      const atackers = this.getAtackers(this);
      if (atackers.length > 1) {
        return true;
      } else {
        const atacker = atackers[0];

        if (this.getAtackers(atacker).length === 0) {
          if ([pieceType.PAWN, pieceType.HORSE].includes(atacker.getType())) {
            return true;
          } else {
            let deltaX = atacker.getPosition().x - this.getPosition().x;
            let deltaY = atacker.getPosition().y - this.getPosition().y;
            const stepX = deltaX !== 0 ?  -deltaX / Math.abs(deltaX) : 0;
            const stepY = deltaY !== 0 ?  -deltaY / Math.abs(deltaY) : 0;
            deltaX += stepX;
            deltaY += stepY;
            const pieces = this.getAllPieces().filter(p => p !== null && p.isWhite === this.isWhite);
            while (deltaX  !== 0 || deltaY !== 0) {
              console.log(deltaX);
              console.log(deltaY);
              if (pieces.some(p => p.canBeMovedTo({x: this.getPosition().x + deltaX, y : this.getPosition().y + deltaY}).isValid)) {
                return false;
              }
              deltaX += stepX;
              deltaY += stepY;
           }
            return true;
          }

        }
      }
    }

    return false;
  }

  private getAtackers(piece: Piece): Piece[] {
    let diagonalAtackers: Piece[] = [
      this.getFirstCollision(piece.getPosition(), 1, 1, false),
      this.getFirstCollision(piece.getPosition(), -1, 1, false),
      this.getFirstCollision(piece.getPosition(), 1, -1, false),
      this.getFirstCollision(piece.getPosition(), -1, -1, false)
    ];

    diagonalAtackers = diagonalAtackers.filter(
      atacker => atacker !== null &&
        piece.isWhite !== atacker.isWhite &&
        [pieceType.BISHOP, pieceType.QUEEN].includes(atacker.getType())
    );
    let inLineAtackers: Piece[] = [
      this.getFirstCollision(piece.getPosition(), 1, 0, false),
      this.getFirstCollision(piece.getPosition(), -1, 0, false),
      this.getFirstCollision(piece.getPosition(), 0, -1, false),
      this.getFirstCollision(piece.getPosition(), 0, 1, false)
    ];
    inLineAtackers = inLineAtackers.filter(
      atacker => atacker !== null &&
        piece.isWhite !== atacker.isWhite &&
        [pieceType.ROOK, pieceType.QUEEN].includes(atacker.getType())
    );

    let horseAtackers: Piece[] = [
      this.getFirstCollision(piece.getPosition(), 2, 1, false),
      this.getFirstCollision(piece.getPosition(), 2, -1, false),
      this.getFirstCollision(piece.getPosition(), -2, 1, false),
      this.getFirstCollision(piece.getPosition(), -2, -1, false),
      this.getFirstCollision(piece.getPosition(), 1, 2, false),
      this.getFirstCollision(piece.getPosition(), 1, -2, false),
      this.getFirstCollision(piece.getPosition(), -1, 2, false),
      this.getFirstCollision(piece.getPosition(), -1, -2, false)];

    horseAtackers = horseAtackers.filter(
      atacker => atacker !== null &&
        piece.isWhite !== atacker.isWhite && atacker.getType() === pieceType.HORSE
    );

    const pawnDirection = piece.isWhite ? -1 : 1;
    let pawnAtackers: Piece[] = [
      this.getFirstCollision(piece.getPosition(), 1, pawnDirection, true),
      this.getFirstCollision(piece.getPosition(), -1, pawnDirection, true)
    ];

    pawnAtackers = pawnAtackers.filter(
      atacker => atacker !== null &&
        piece.isWhite !== atacker.isWhite && atacker.getType() === pieceType.PAWN
    );

    return []
      .concat(diagonalAtackers)
      .concat(inLineAtackers)
      .concat(horseAtackers)
      .concat(pawnAtackers);
  }

  public isStaleMated(): boolean {

    for (const piece of this.getAllPieces().filter(
      p => p !== null && p.isWhite === this.isWhite)) {
      if (piece.hasMoves()) {
        return false;
      }
    }
    return true;
  }

  public isBeingChecked(): boolean {
    return this.positionInCheck(this.getPosition(), this.isWhite);
  }

protected getAvailableAbsolutePositions(): Position[] {

  const availableMoves = [];

  for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 && j !== 0) {
          if (this.canBeMovedTo( { x: this.getPosition().x + i, y: this.getPosition().y + j } ).isValid) {
            availableMoves.push({ x: this.getPosition().x + i, y: this.getPosition().y + j });
          }
      }
    }
  }
  return availableMoves;
}

}
