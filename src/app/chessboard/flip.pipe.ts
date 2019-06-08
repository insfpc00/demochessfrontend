import { PipeTransform, Pipe } from '@angular/core';
import { Position } from './model/piece';
@Pipe({ name: 'flip' })
export class FlipPositionPipe implements PipeTransform {
  transform(position: Position, flip: boolean) {
    return flip ? { x: 7 - position.x, y: 7 - position.y } : position;
  }
}
