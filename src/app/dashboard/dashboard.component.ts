import { MatchSearchParams } from './../core/matchservice.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from './../model/userdto.model';
import { UserService } from './../core/user.service';
import { Component, OnInit } from '@angular/core';
import { Match } from '../model/match.model';
import { MatchService } from '../core/matchservice.service';
import { Router } from '@angular/router';
import { timeControlTypes } from 'src/app/timecontrol/timecontrol.pipe';;

interface MatchSearchForm {
  white?: boolean;
  black?: boolean;
  bullet?: boolean;
  blitz?: boolean;
  rapid?: boolean;
  win?: boolean;
  loss?: boolean;
  draw?: boolean;
  since?: NgbDate;
  sinceChanged: boolean;
  until?: NgbDate;
  untilChanged: boolean;
  result?: string;
  opponent?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private _lastSearch: MatchSearchParams;
  matches: Match[] = [];
  userDto: UserDto;
  avatarBlob: any;
  private _page = 1;
  private _pageSize = 10;
  public searchCount = 0;
  public searchForm: MatchSearchForm;
  protected clearForm: MatchSearchForm;
  public filtersCollapsed;

  get page() {
    return this._page;
  }

  set page(page: number) {
    this._page = page;
    this.getMatches();
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pagesize: number) {
    this._pageSize = pagesize;
    this.getMatches();

  }

  constructor(public userService: UserService, private matchService: MatchService, public router: Router) {
    this.filtersCollapsed = false;
    const now: Date = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.clearForm = {
      white: true,
      black: true,
      bullet: true,
      blitz: true,
      rapid: true,
      since: new NgbDate(year - 5, month, day),
      sinceChanged: false,
      until: new NgbDate(year, month, day),
      untilChanged: false,
      win: true,
      loss: true,
      draw: true,
      opponent: ''
    };
    this.searchForm = Object.assign({}, this.clearForm);
  }

  public clearSearchForm() {
    this.searchForm = Object.assign({}, this.clearForm);
    this.search();
  }
  public search() {
    this._lastSearch = {};
    const ngbDateToDate = (v: NgbDate) => (v.year + '-' + v.month + '-' + v.day);

    const colors = [];

    if (!this.searchForm.white && !this.searchForm.black) {
      this.searchForm.white = this.searchForm.black = true;
    }

    if (this.searchForm.white) {
      colors.push('WHITE');
    }
    if (this.searchForm.black) {
      colors.push('BLACK');
    }

    this._lastSearch.colors = colors;

    if (this.searchForm.opponent !== '') {
      this._lastSearch.opponent = this.searchForm.opponent;
    }

    if (this.searchForm.sinceChanged) {
      this._lastSearch.since = ngbDateToDate(this.searchForm.since);
    }

    if (this.searchForm.untilChanged) {
      this._lastSearch.until = ngbDateToDate(this.searchForm.until);
    }
    const searchTimeControlTypes = [];

    if (!this.searchForm.bullet && !this.searchForm.blitz && !this.searchForm.rapid) {
      this.searchForm.bullet = this.searchForm.blitz = this.searchForm.rapid = true;
    }
    if (this.searchForm.bullet) {
      searchTimeControlTypes.push(timeControlTypes.bullet.toUpperCase());
    }

    if (this.searchForm.blitz) {
      searchTimeControlTypes.push(timeControlTypes.blitz.toUpperCase());
    }

    if (this.searchForm.rapid) {
      searchTimeControlTypes.push(timeControlTypes.rapid.toUpperCase());
    }

    this._lastSearch.timeControlTypes = searchTimeControlTypes;

    if (!this.searchForm.win && !this.searchForm.loss && !this.searchForm.draw) {
      this.searchForm.win = this.searchForm.loss  = this.searchForm.draw = true;
    }
    const searchResults = [];
    if (this.searchForm.win) {
      searchResults.push('WIN');
    }
    if (this.searchForm.loss) {
      searchResults.push('LOSS');
    }

    if (this.searchForm.draw) {
      searchResults.push('DRAW');
    }

    this._lastSearch.results = searchResults;

    this.getMatches();
  }

  private getMatches() {
    this.matchService.searchMatches(this.page - 1, this.pageSize, this._lastSearch)
      .subscribe(pagedMatches => { this.matches = pagedMatches.content; this.searchCount = pagedMatches.totalElements; });
  }
  ngOnInit() {
    this.userService.getUserProfile().subscribe( u => this.userDto = u);
    this.getMatches();
    // this.matchService.getMatches().subscribe(matches => { this.matches = matches; });
  }

  onSelectMatch(selectedMatchId: number) {
    this.router.navigate(['/analysisboard', { matchId: selectedMatchId }]);
  }


}
