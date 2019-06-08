import { MoveDto } from './../chessboard/model/move';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Move } from '../chessboard/model/move';
import { AppConfig } from '../app.config';

export interface PlayedPuzzle {
  puzzle: Puzzle;
  lastTry?: string;
  ended?: boolean;
}

export interface MoveResponse {
  move: MoveDto;
  finalMove: boolean;
}

export interface Puzzle {
  label: string;
  startingFen: string;
  complexity: number;
  description: string;
  secondsAvailable: number;
  category: string;
  tips: string[];
  firstMove: MoveDto;
  numberOfWrongMovesAllowed: number;
}
@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  baseUrl = AppConfig.settings.apiServer.baseUrl + '/puzzle';

  constructor(private http: HttpClient) { }

  getPuzzles(): Observable<PlayedPuzzle[]> {
  return this.http.get<PlayedPuzzle[]>(this.baseUrl);
  }

  move(puzzle: string, move: Move ): Observable<MoveResponse> {
    const moveDto = Object.assign({}, move);
    moveDto.piece = null;
    return this.http.post<MoveResponse>(this.baseUrl + '/' + puzzle + '/move', moveDto);
  }

  play(puzzle: string): Observable<Puzzle> {
    return this.http.post<Puzzle>(this.baseUrl + '/' + puzzle + '/play', {});
  }

}
