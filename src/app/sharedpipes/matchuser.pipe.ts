import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '../model/userdto.model';
import { Match } from '../model/match.model';

@Pipe({
  name: 'matchuser'
})
export class MatchuserPipe implements PipeTransform {

  transform(match: Match , white: boolean): UserDto {
    return white ? match.whitePiecesUser : match.blackPiecesUser;
  }

}
