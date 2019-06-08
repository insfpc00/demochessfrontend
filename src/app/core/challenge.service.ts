import { Injectable } from '@angular/core';
import { Challenge } from '../model/challenge.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Match } from '../model/match.model';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  baseUrl = AppConfig.settings.apiServer.baseUrl + '/challenge/';

  constructor(private http: HttpClient) {
  }
  onSelect(challenge: Challenge){
    alert(challenge);
  }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseUrl);
  }

  createChallenge(challenge: Challenge): Observable<Match> {
    return this.http.post<Match>(this.baseUrl, challenge );
  }

  acceptChallenge(challenge: Challenge): Observable<Match> {
    return this.http.post<Match>(this.baseUrl + 'accept/', challenge );
  }

  clearAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

}
