import { MatchesStats } from './../model/matchesstats';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { AuthToken } from './authtoken';
import { myRxStompConfig } from '../custom-rx-stomp.config';
import { map, tap, flatMap } from 'rxjs/operators';
import { UserDto } from '../model/userdto.model';
import { UserStats } from '../model/userstats';
import { AppConfig } from '../app.config';


export interface MatchHistoryStats {
  blitzStats: MatchesStats;
  bulletStats: MatchesStats;
  rapidStats: MatchesStats;
}

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {

  baseUrl = AppConfig.settings.apiServer.baseUrl + '/user';
  loggedUser: string;
  loggedUserProfile: UserDto;

  constructor(private http: HttpClient) { }

  private set userProfile(userProfile: UserDto) {
    this.loggedUserProfile = userProfile;
    this.selectTheme(userProfile.theme);
  }

  ngOnDestroy(): void {
    this.logout();
  }
  getLoggedUserProfile() {
    return this.loggedUserProfile;
  }

  isAuthenticated(): boolean {
    // return window.sessionStorage.getItem('token') != null;
    if (this.loggedUser) {
      return true;
    } else {
      return false;
    }
  }

  getEloStats(until: string, groupBy: string, count: number): Observable<UserStats> {
    let getParams = new HttpParams();
    getParams = getParams.append('groupBy', groupBy);
    getParams = getParams.append('count', count.toString());
    getParams = getParams.append('until', until);
    return this.http.get<UserStats>(this.baseUrl + '/elo/stats', { params: getParams });
  }

  getMatchesStats(until?: string, groupBy?: string, count?: number): Observable<MatchHistoryStats> {
    let getParams = new HttpParams();

    if (groupBy && count && until) {
      getParams = getParams.append('groupBy', groupBy);
      getParams = getParams.append('count', count.toString());
      getParams = getParams.append('until', until);
    }

    return this.http.get<MatchHistoryStats>(this.baseUrl + '/matches/stats', { params: getParams });
  }

  getUserProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(this.baseUrl);
  }

  login(loginPayload): Promise<any> {

    return this.http
      .post<AuthToken>(
        AppConfig.settings.apiServer.baseUrl + '/token/generate-token',
        loginPayload
      )
      .pipe(
        tap((data: AuthToken) => {
          window.sessionStorage.setItem('token', data.token);
          window.sessionStorage.setItem('user', loginPayload.username);
          myRxStompConfig.connectHeaders = {
            login: loginPayload.username,
            jwt: data.token
          };
          this.loggedUser = loginPayload.username;
        }), flatMap(() => this.getUserProfile())).toPromise()
      .then(profile => {
        this.loggedUserProfile = profile;
        return this.selectTheme(profile.theme); });
  }

  private selectTheme(theme: string): Promise<any> {
    const cssFilePrefix = theme === 'DEFAULT' ? 'bootstrap' : this.loggedUserProfile.theme.toLowerCase();
    const promise = new Promise<any>(resolve =>
      this.loadCSS('./assets/css/' + cssFilePrefix + '.min.css', previousThemeEl => {
        resolve(); previousThemeEl.parentNode.removeChild(previousThemeEl);
      }));
    return promise;
  }

  loginAsGuest(): Promise<any> {
    return this.http
      .post<AuthToken>(
        AppConfig.settings.apiServer.baseUrl + '/token/generate-guest-token',
        {}
      )
      .pipe(
        tap((data: AuthToken) => {
          window.sessionStorage.setItem('token', data[0].token);
          const username = data[1];
          window.sessionStorage.setItem('user', username);
          this.loggedUser = username;

          myRxStompConfig.connectHeaders = { login: username, jwt: data.token };
          //return data;
        }), flatMap(() => this.getUserProfile())).toPromise()
      .then(profile => { this.loggedUserProfile = profile; });
  }

  logout() {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('user');
    this.loggedUserProfile = null;
    this.loggedUser = null;
    this.selectTheme('DEFAULT');
  }

  changePassword(passwordForm: { oldPassword: string, newPassword: string }): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/password', passwordForm);
  }

  updateUser(updateForm: { country: string, theme: string, title: string }): Observable<any> {
    return this.http.put<any>(this.baseUrl, updateForm).pipe(tap(user => this.userProfile = user));
  }


  signUp(signUpPayload: UserDto, avatarFile: File): Observable<UserDto> {
    return this.http
      .post<UserDto>(this.baseUrl + '/signup', signUpPayload)
      .pipe(
        flatMap((data: UserDto) => {
          const loginPromise = this.login({
            username: signUpPayload.username,
            password: signUpPayload.password
          });
          if (avatarFile) {
            const formdata = new FormData();
            formdata.append('avatar', avatarFile);
            return loginPromise.then(result =>
              this.http
                .put<{}>(this.baseUrl + '/avatar', formdata)
                .pipe(map(s => result))
                .toPromise()
            );
          } else {
            return loginPromise;
          }
        })
      );
  }

  uploadAvatar(avatarFile: File): Observable<any> {
    const formdata = new FormData();
    formdata.append('avatar', avatarFile);
    return this.http.put<UserDto>(this.baseUrl + '/avatar', formdata)
      .pipe(tap(user => this.userProfile = user));
  }

  private loadCSS(url, callback) {
    const elementToRemove = document.getElementById('theme');
    //element.parentNode.removeChild(element);
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.id = 'theme';
    link.href = url;

    document.getElementsByTagName('head')[0].appendChild(link);

    let img = document.createElement('img');
    img.onerror = function () {
      callback(elementToRemove);
    };
    img.src = url;
  }
}


