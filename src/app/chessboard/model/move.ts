import {Piece, Position } from './piece';
import { SimplePiece } from './simplepiece';
import { Deserializable } from './deserializable';

export interface MoveAnalysis {
  bestMove: string;
  score?: number;
  mateInX?: number;
}
export class MoveDto implements Deserializable {

  number: number;
  id: number;
  from: Position;
  to: Position;
  acn: string;
  color?: boolean;
  timeInMillis?: number;
  promotedTo?: string;
  analysis?: MoveAnalysis;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

}

export class Move extends MoveDto {
  piece: SimplePiece;
  constructor(id: number, piece: SimplePiece, from: Position, to: Position) {
    super();
    this.id = id;
    this.piece = piece;
    this.from = from;
    this.to = to;
  }


}
