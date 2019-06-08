import { PipeTransform, Pipe } from '@angular/core';
import { Piece } from './model/piece';
import { Pawn } from './model/pawn';
import { Horse } from './model/horse';
import { Bishop } from './model/bishop';
import { King } from './model/king';
import { Rook } from './model/rook';
import { Queen } from './model/queen';

@Pipe({ name: 'advantage'})
export class AdvantagePipe implements PipeTransform {
  transform(pieces: Piece[], white: boolean, trigger: number): string {
    const evaluate = (p: Piece): number => {
      if (p instanceof Pawn) { return 1; }
      if (p instanceof Bishop) { return 3; }
      if (p instanceof Horse) { return 3; }
      if (p instanceof Queen) { return 9; }
      if (p instanceof King) { return 0; }
      if (p instanceof Rook) { return 5; }
    };

    const whiteVal = pieces.filter(p => p.isWhite).map(p => evaluate(p)).reduce((p1, p2) => p1 + p2);
    const blackVal = pieces.filter(p => !p.isWhite).map(p => evaluate(p)).reduce((p1, p2) => p1 + p2);

    let result = whiteVal - blackVal;
    result = (white ? 1 : -1) * result;

    if (result === 0) {
      return '';
    } else if (result > 0) {
      return '+' + result;
    } else {
      return result.toString();
    }
  }
}
