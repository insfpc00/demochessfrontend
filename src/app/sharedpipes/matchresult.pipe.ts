import { Match, matchStates } from '../model/match.model';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'result' })
export class MatchResultPipe implements PipeTransform {
  transform(match: Match, username: string) {

    if (match.state === matchStates.draw ) {
      return 'draw';
    } else if ((match.state === matchStates.white_win && match.whitePiecesUser.username === username)
    || (match.state === matchStates.black_win && match.blackPiecesUser.username === username)) {
      return 'win';
    } else if ([matchStates.draw, matchStates.draw, matchStates.draw].includes(match.state)) {
      return match.state;
    } else {
      return 'loss'; }
  }
}
