import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoveDto, MoveAnalysis} from '../chessboard/model/move';
import {formatPosition} from '../utils/utils';
import { AppConfig } from '../app.config';

export interface MovesOpeningPair {
  moves: string;
  openingName: string;
}



@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private _baseUrl = AppConfig.settings.apiServer.baseUrl + '/analysis/';

  constructor(private http: HttpClient) { }

  getOpenings(moves: MoveDto[]): Observable<MovesOpeningPair[]> {

    const movesStr = moves.map( m => formatPosition(m.from) + formatPosition(m.to)).reduce((a, b) => a + ' ' + b);
    let getParams = new HttpParams();
    getParams = getParams.append('moves', movesStr);
    return this.http.get<MovesOpeningPair[]>(this._baseUrl + 'openings', { params: getParams });
  }

  getAnalysis( matchId: number): Observable<MoveAnalysis[]>{
    return this.http.put<MoveAnalysis[]>(this._baseUrl + 'match/' + matchId, {});
  }

}
