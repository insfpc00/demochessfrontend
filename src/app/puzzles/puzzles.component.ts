import { Subscription } from 'rxjs';
import { PuzzleService, PlayedPuzzle, Puzzle } from './../core/puzzle.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SearchEvent } from '../searchable/searchable.directive';

@Component({
  selector: 'app-puzzles',
  templateUrl: './puzzles.component.html',
  styleUrls: ['./puzzles.component.css']
})
export class PuzzlesComponent implements OnInit {

  puzzles: PlayedPuzzle[] = [];
  page = 1;
  pageSize = 10;
  selectedPuzzle: Puzzle;
  navigationSubscription: Subscription;
  filtersCollapsed = false;
  private filters = {};
  categories: string[];
  difficultyLevels: string[];
  filteredPuzzlesLength: number;

  constructor(protected puzzleService: PuzzleService, protected router: Router, private route: ActivatedRoute) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.puzzleService.getPuzzles().subscribe(puzzles => {
      this.puzzles = puzzles;
      this.categories = puzzles.map(p => p.puzzle.category).filter((v, idx, s) => s.indexOf(v) === idx);
      this.difficultyLevels = puzzles.map(p => p.puzzle.complexity.toString()).filter((v, idx, s) => s.indexOf(v) === idx);
    }
    );
  }

  get pagedPuzzles(): PlayedPuzzle[] {
    let filtered = this.applyFilters(this.puzzles);
    this.filteredPuzzlesLength = filtered.length;
    return filtered
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  onSelect(playedPuzzle: PlayedPuzzle) {
    this.router.navigate(['./play', { puzzle: playedPuzzle.puzzle.label }], { relativeTo: this.route });
  }

  private applyFilters(puzzles: PlayedPuzzle[]): PlayedPuzzle[] {
    let filteredPuzzles = puzzles;
    for (const key of Object.keys(this.filters)) {
      filteredPuzzles = filteredPuzzles.filter(p => {
        const keys = key.split('.');
        let term = p;
        for (const partialKey of keys) {
          term = term[partialKey];
        }
        //console.log(this.filters[key]);
        //console.log(term.toString());
        //console.log(term.toString().includes(this.filters[key]));
        return term.toString().includes(this.filters[key])
      });
    }
    return filteredPuzzles;
  }

  onFilter({ key, term }: SearchEvent) {
    if (term && term !== '') {
      this.filters[key] = term;
    } else {
      delete this.filters[key];
    }
  }
}
