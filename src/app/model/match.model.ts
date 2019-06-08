import { UserDto } from './userdto.model';
import { TimeControlled } from './timecontrolled.model';

export const matchStates = {
  started: 'STARTED',
  white_win: 'WHITE_WIN',
  black_win: 'BLACK_WIN',
  draw: 'DRAW',
  cancelled: 'CANCELLED'};

export class Match extends TimeControlled{
  matchId: number;
  creationDate: number;
  whitePiecesUser: UserDto;
  blackPiecesUser: UserDto;
  state: string;
}
