import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Challenge } from '../model/challenge.model';
import { ChallengeService } from '../core/challenge.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RxStompService} from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { Match } from '../model/match.model';
import { UserService } from '../core/user.service';
import { NgbdSortableHeader, SortEvent } from '../sortable/sortable.directive';
import { SearchEvent } from '../searchable/searchable.directive';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LeavedialogComponent } from './leavedialog/leavedialog.component';
import { CanComponentDeactivate } from '../can-deactivate.guard';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit, OnDestroy, CanComponentDeactivate {



  public challenges: Challenge[] = [];
  private filters = {};
  page = 1;
  pageSize = 10;
  color = new FormControl('');
  time = new FormControl('');
  increment = new FormControl('');
  challenge: Challenge = new Challenge('WHITE' , 180 , 2);
  private challengesTopicSubscription: Subscription;
  private challengesAcceptedTopicSubscription: Subscription;
  private challengesDeletedTopicSubscription: Subscription;
  filtersCollapsed = true;
  public hasChallengesPending = false;
  private _leaveDialogRef: MatDialogRef<LeavedialogComponent, boolean>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;


  constructor(private challengeService: ChallengeService, private router: Router,
              private rxStompService: RxStompService, public userService: UserService,
              protected matDialog: MatDialog) {
  }

  async openLeaveDialog(): Promise<boolean> {
    this._leaveDialogRef = this.matDialog.open(LeavedialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {}
    });
    return await this._leaveDialogRef.afterClosed().toPromise();
  }

  canDeactivate() {
    return this.hasChallengesPending ? this.openLeaveDialog() : true;
  }

  ngOnDestroy(): void {
    if (this.challengesTopicSubscription) {
    this.challengesTopicSubscription.unsubscribe();
  }

    if (this.challengesAcceptedTopicSubscription) {
    this.challengesAcceptedTopicSubscription.unsubscribe();
  }

    if (this.challengesDeletedTopicSubscription) {
    this.challengesDeletedTopicSubscription.unsubscribe();
  }
}
  onSelect(challenge: Challenge): void {
    if (challenge.userName !== this.userService.loggedUser) {
    this.challengeService.acceptChallenge(challenge)
    .subscribe((match: Match) => this.acceptMatch(match.matchId)); }
  }

  onClearAll(){
    this.challengeService.clearAll().subscribe(() => { this.hasChallengesPending = false; });
  }
  createChallenge() {
    this.hasChallengesPending = true;
    this.challenge.userName = this.userService.loggedUser;
    this.challengeService.createChallenge(this.challenge)
    .subscribe(receivedMatch => {
      if (receivedMatch) {
        this.acceptMatch(receivedMatch.matchId); }});
  }

  createDefaultChallenge(time: number, increment: number) {
    this.challenge.color = 'RANDOM';
    this.challenge.timeInSeconds = time;
    this.challenge.timeIncrementInSeconds = increment;
    this.createChallenge();
  }

  challengeClicked(id) {
    this.onSelect(this.challenges.filter(c => c.challengeId === id)[0]);
  }

  get pagedChallenges(): Challenge[] {
    return this.applyFilters(this.challenges)
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  ngOnInit() {
    this.challengeService.getChallenges().subscribe(challenges => this.challenges = challenges);
    this.challengesTopicSubscription = this.rxStompService.watch('/topic/challenges').
    subscribe((message: Message) => {
      const data: Challenge = JSON.parse(message.body);
      this.challenges.unshift(data);
      }
    );

    this.challengesAcceptedTopicSubscription = this.rxStompService.watch('/topic/acceptedchallenges').
    subscribe((message: Message) => {

      const data: Challenge = JSON.parse(message.body);

      this.challenges = this.challenges.filter(c => c.challengeId !== data.challengeId);

      if (data.userName === this.userService.loggedUser) {
        this.acceptMatch(data.matchId);
      }
    });

    this.challengesDeletedTopicSubscription = this.rxStompService.watch('/topic/deletedchallenges').
    subscribe((message: Message) => {

      const data: Challenge = JSON.parse(message.body);
      this.challenges = this.challenges.filter(c => c.challengeId !== data.challengeId);

    });
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.sortChallenges(column, direction);
  }

  private applyFilters(challenges: Challenge[]): Challenge[] {
    let filteredChallenges = challenges;
    for (const key of Object.keys(this.filters)) {
      filteredChallenges = filteredChallenges.filter(c => c[key] && c[key].toString().includes(this.filters[key]));
    }
    return filteredChallenges;
  }

  onFilter({key, term}: SearchEvent) {
    if (term && term !== '') {
      this.filters[key] = term;
    } else {
      delete this.filters[key];
    }
  }

  private sortChallenges(column: string, direction: string) {
    if (direction === '') {

    } else {
      this.challenges = this.challenges.sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  private acceptMatch(id: number) {
    if (this._leaveDialogRef){
      this._leaveDialogRef.close();
    }
    this.hasChallengesPending = false;
    this.router.navigate(['/board', {matchId: id}]);
  }
}
