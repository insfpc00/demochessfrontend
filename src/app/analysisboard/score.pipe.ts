import { Pipe, PipeTransform } from '@angular/core';
import { MoveAnalysis } from '../chessboard/model/move';


@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {

  transform(analysis: MoveAnalysis, args?: any): number {
    if (analysis.score) {
      return Math.min(Math.max((1000 + analysis.score) / 20, 0), 100);
    } else if (analysis.mateInX) {
      if (analysis.mateInX < 0) {
        return 0;
      } else { return 100; }
    }
    return 50;
  }

}
