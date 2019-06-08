import { matchStates } from './../model/match.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../model/match.model';
import { MoveDto } from '../chessboard/model/move';
import { AppConfig } from '../app.config';

export interface MatchSearchParams {
  colors?: string[];
  timeControlTypes?: string[];
  since?: string;
  until?: string;
  results?: string[];
  opponent?: string;
}

export interface PagedMatches {
  totalElements: number;
  totalPages: number;
  content: Match[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  baseUrl = AppConfig.settings.apiServer.baseUrl + '/match';
  constructor(private http: HttpClient) { }

  getMatch(matchId: number): Observable<Match> {
    return this.http.get<Match>(this.baseUrl + '/' + matchId);
  }

  searchMatches(page: number, count: number, matchSearchParams?: MatchSearchParams): Observable<PagedMatches> {

    let getParams = new HttpParams();
    if (matchSearchParams) {
      if (matchSearchParams.colors) {
        for (const color of matchSearchParams.colors) {
          getParams = getParams.append('color', color);
        }
      }
      if (matchSearchParams.opponent) {
        getParams = getParams.append('opponent', matchSearchParams.opponent);
      }
      if (matchSearchParams.timeControlTypes) {
        for (const controlType of matchSearchParams.timeControlTypes) {
          getParams = getParams.append('timeControlTypes', controlType);
        }
      }

      if (matchSearchParams.since) {
        getParams = getParams.append('since', matchSearchParams.since);
      }

      if (matchSearchParams.until) {
        getParams = getParams.append('until', matchSearchParams.until);
      }

      if (matchSearchParams.results) {
        for (const result of matchSearchParams.results) {
          getParams = getParams.append('result', result);
        }
      }
    }

    getParams = getParams.append('page', page.toString());
    getParams = getParams.append('count', count.toString());

    return this.http.get<PagedMatches>(this.baseUrl, { params: getParams });

  }
  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.baseUrl + '/all');
  }

  getMoves(matchId: number): Observable<MoveDto[]> {
    return this.http.get<MoveDto[]>(this.baseUrl + '/moves?matchId=' + matchId);
  }

}
